// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, Coerce, ComponentFactory, GeneralError, Is, type IError } from "@twin.org/core";
import { JsonLdHelper } from "@twin.org/data-json-ld";
import type { IIdentityComponent } from "@twin.org/identity-models";
import { nameof } from "@twin.org/nameof";
import type { ITrustVerificationInfo, ITrustVerifier } from "@twin.org/trust-models";
import { Jwt } from "@twin.org/web";
import type { IJwtVerifiableCredentialVerifierConstructorOptions } from "../models/IJwtVerifiableCredentialVerifierConstructorOptions.js";

/**
 * Class to verify a JWT Verifiable Credential.
 */
export class JwtVerifiableCredentialVerifier implements ITrustVerifier {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<JwtVerifiableCredentialVerifier>();

	/**
	 * The identity component.
	 * @internal
	 */
	private readonly _identityComponent: IIdentityComponent;

	/**
	 * Create a new instance of JwtVerifiableCredentialVerifier.
	 * @param options The options for the service.
	 */
	constructor(options?: IJwtVerifiableCredentialVerifierConstructorOptions) {
		this._identityComponent = ComponentFactory.get(options?.identityComponentType ?? "identity");
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
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
			const jwt = await Jwt.decode(payload);

			if (Is.objectValue(jwt.header) && Is.object(jwt.payload) && Is.uint8Array(jwt.signature)) {
				let isVerified = true;
				try {
					const expiredMs = (Coerce.number(jwt.payload.exp) ?? 0) * 1000;
					if (expiredMs > 0 && expiredMs < Date.now()) {
						errors.push(
							new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenExpired")
						);
						isVerified = false;
					}

					const verificationResult =
						await this._identityComponent.verifiableCredentialVerify(payload);

					const verifiableCredential = verificationResult.verifiableCredential;
					if (Is.empty(verifiableCredential)) {
						errors.push(
							new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingCredential")
						);
						isVerified = false;
					} else {
						info.data ??= {};
						info.data.verifiableCredential = JsonLdHelper.toNodeObject(verifiableCredential);
					}

					const issuer: string | undefined = Is.stringValue(verifiableCredential?.issuer)
						? verifiableCredential?.issuer
						: undefined;
					if (Is.empty(issuer)) {
						errors.push(
							new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingIssuer")
						);
						isVerified = false;
					} else {
						info.identity = issuer;
					}

					const subject = verifiableCredential?.credentialSubject;
					if (Is.empty(subject)) {
						errors.push(
							new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingSubject")
						);
						isVerified = false;
					} else {
						info.data ??= {};
						info.data.subject = JsonLdHelper.toNodeObject(subject);
					}
				} catch (err) {
					isVerified = false;
					errors.push(
						new GeneralError(
							JwtVerifiableCredentialVerifier.CLASS_NAME,
							"tokenDecodingFailed",
							undefined,
							BaseError.fromError(err)
						)
					);
				}

				return isVerified;
			}
		}
	}
}
