// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	BaseError,
	Coerce,
	ComponentFactory,
	Converter,
	GeneralError,
	Is,
	LruCache,
	ObjectHelper,
	type IError
} from "@3sixty/core";
import { Blake2b } from "@3sixty/crypto";
import { JsonLdHelper } from "@3sixty/data-json-ld";
import type { IIdentityComponent } from "@3sixty/identity-models";
import { nameof } from "@3sixty/nameof";
import type { ITrustVerificationInfo, ITrustVerifier } from "@3sixty/trust-models";
import { Jwt } from "@3sixty/web";
import type { IJwtVerifiableCredentialVerifierConstructorOptions } from "../models/IJwtVerifiableCredentialVerifierConstructorOptions.js";
import type { IJwtVerificationCacheEntry } from "../models/IJwtVerificationCacheEntry.js";

/**
 * Class to verify a JWT Verifiable Credential.
 */
export class JwtVerifiableCredentialVerifier implements ITrustVerifier {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<JwtVerifiableCredentialVerifier>();

	/**
	 * Default time-to-idle in milliseconds for cached verification results.
	 * @internal
	 */
	private static readonly _DEFAULT_CACHE_TTI_MS: number = 5000;

	/**
	 * Default maximum number of cached verification results.
	 * @internal
	 */
	private static readonly _DEFAULT_CACHE_CAPACITY: number = 1000;

	/**
	 * The identity component.
	 * @internal
	 */
	private readonly _identityComponent: IIdentityComponent;

	/**
	 * LRU cache for verification results, keyed on the hash of the payload.
	 * Undefined when caching is disabled (tti is 0).
	 * @internal
	 */
	private readonly _verificationCache?: LruCache<IJwtVerificationCacheEntry>;

	/**
	 * Creates a new instance of JwtVerifiableCredentialVerifier.
	 * @param options The options for the verifier.
	 */
	constructor(options?: IJwtVerifiableCredentialVerifierConstructorOptions) {
		this._identityComponent = ComponentFactory.get(options?.identityComponentType ?? "identity");

		const cacheTtiMs =
			options?.config?.verificationCacheTtiMs ??
			JwtVerifiableCredentialVerifier._DEFAULT_CACHE_TTI_MS;
		this._verificationCache =
			cacheTtiMs > 0
				? new LruCache<IJwtVerificationCacheEntry>({
						capacity:
							options?.config?.verificationCacheCapacity ??
							JwtVerifiableCredentialVerifier._DEFAULT_CACHE_CAPACITY,
						ttiMs: cacheTtiMs,
						mutexTimeoutMs: options?.config?.verificationCacheMutexTimeoutMs
					})
				: undefined;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The runtime class name string
	 */
	public className(): string {
		return JwtVerifiableCredentialVerifier.CLASS_NAME;
	}

	/**
	 * Verify a payload by checking the validity of its structure and content.
	 * @param payload The payload to verify.
	 * @param info Information extracted from previous verifiers and to be added by this verifier.
	 * @param info.identity The identity associated with the payload.
	 * @param errors Array to collect verification errors.
	 * @returns Whether the payload is verified, returns undefined if payload was not processed.
	 */
	public async verify(
		payload: unknown,
		info: ITrustVerificationInfo,
		errors: IError[]
	): Promise<boolean | undefined> {
		if (Is.stringValue(payload)) {
			let cacheKey: string | undefined;
			let result: IJwtVerificationCacheEntry | undefined;

			if (Is.notEmpty(this._verificationCache)) {
				cacheKey = this.cacheKey(payload);
				result = this._verificationCache.get(cacheKey);
			}

			if (Is.empty(result)) {
				result = await this.verificationResult(payload, cacheKey);
			}

			if (Is.notEmpty(result)) {
				errors.push(...result.errors);

				if (Is.notEmpty(result.identity)) {
					info.identity = result.identity;
				}

				if (Is.notEmpty(result.data)) {
					info.data ??= {};
					// Cloned so a consumer mutating the info cannot corrupt the cached result.
					Object.assign(info.data, ObjectHelper.clone(result.data));
				}

				return result.verified;
			}
		}
	}

	/**
	 * Build the cache key for a payload. The payload is hashed so the tokens themselves are not
	 * held in memory for the life of their cache entries.
	 * @param payload The payload to build a key for.
	 * @returns The cache key.
	 * @internal
	 */
	private cacheKey(payload: string): string {
		return Converter.bytesToHex(Blake2b.sum256(Converter.utf8ToBytes(payload)));
	}

	/**
	 * Get the verification result for a payload, returning the cached one when the cache holds it.
	 * @param payload The payload to verify.
	 * @param cacheKey The key the result is cached under, undefined when caching is disabled.
	 * @returns The verification result, undefined when the payload is not a JWT.
	 * @internal
	 */
	private async verificationResult(
		payload: string,
		cacheKey?: string
	): Promise<IJwtVerificationCacheEntry | undefined> {
		const jwt = await Jwt.decode(payload);
		if (!Is.objectValue(jwt.header) || !Is.object(jwt.payload) || !Is.uint8Array(jwt.signature)) {
			// Probably not a JWT, so let the next verifier handle it.
			return;
		}

		const expiresMs = Math.floor((Coerce.number(jwt.payload.exp) ?? 0) * 1000);

		// Nothing worth retaining when caching is disabled or the token has already expired.
		if (
			Is.undefined(this._verificationCache) ||
			!Is.stringValue(cacheKey) ||
			(expiresMs > 0 && expiresMs <= Date.now())
		) {
			return this.buildVerificationResult(payload, expiresMs);
		}

		// The token expiry is handed to the cache as a hard deadline, so a cached result is
		// dropped at whichever of the expiry or the idle window comes first.
		const result = await this._verificationCache.getOrSet(
			cacheKey,
			async () => this.buildVerificationResult(payload, expiresMs),
			expiresMs > 0 ? expiresMs : undefined
		);

		// A verification which did not complete is not a verdict on the token, so it is dropped
		// from the cache and the next call retries instead of being served the failure for the
		// life of the token.
		if (!result.completed) {
			this._verificationCache.delete(cacheKey);
		}

		return result;
	}

	/**
	 * Verify a payload through the identity component.
	 * @param payload The payload to verify.
	 * @param expiresMs The epoch milliseconds at which the token expires, 0 when it has no expiry.
	 * @returns The verification result.
	 * @internal
	 */
	private async buildVerificationResult(
		payload: string,
		expiresMs: number
	): Promise<IJwtVerificationCacheEntry> {
		const result: IJwtVerificationCacheEntry = { verified: true, completed: true, errors: [] };

		try {
			if (expiresMs > 0 && expiresMs < Date.now()) {
				result.errors.push(
					new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenExpired")
				);
				result.verified = false;
			}

			const verificationResult = await this._identityComponent.verifiableCredentialVerify(payload);

			if (verificationResult.revoked) {
				result.errors.push(
					new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenRevoked")
				);
				result.verified = false;
			}

			const verifiableCredential = verificationResult.verifiableCredential;
			if (Is.empty(verifiableCredential)) {
				result.errors.push(
					new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingCredential")
				);
				result.verified = false;
			} else {
				result.data ??= {};
				result.data.verifiableCredential = JsonLdHelper.toNodeObject(verifiableCredential);
			}

			const issuer = verifiableCredential?.issuer;
			if (!Is.stringValue(issuer)) {
				result.errors.push(
					new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingIssuer")
				);
				result.verified = false;
			} else {
				result.identity = issuer;
			}

			const subject = verifiableCredential?.credentialSubject;
			if (Is.empty(subject)) {
				result.errors.push(
					new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingSubject")
				);
				result.verified = false;
			} else {
				result.data ??= {};
				result.data.subject = JsonLdHelper.toNodeObject(subject);
			}
		} catch (err) {
			// The identity component throws for a token it rejected and for a call it could not
			// make, and nothing in the error tells the two apart, so the verification is marked
			// incomplete and the outcome is not retained.
			result.errors.push(
				new GeneralError(
					JwtVerifiableCredentialVerifier.CLASS_NAME,
					"tokenVerificationIncomplete",
					undefined,
					BaseError.fromError(err)
				)
			);
			result.verified = false;
			result.completed = false;
		}

		return result;
	}
}
