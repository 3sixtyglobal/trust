// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, Coerce, ComponentFactory, GeneralError, type IError, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { IIdentityComponent } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { ITrustVerifier } from "@twin.org/trust-models";
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
	 * The logging component.
	 * @internal
	 */
	private readonly _loggingComponent?: ILoggingComponent;

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
		this._loggingComponent = ComponentFactory.getIfExists(
			options?.loggingComponentType ?? "logging"
		);

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
	 * @returns Whether the payload is verified and any additional information extracted from the payload, or verification failures.
	 */
	public async verify(payload: unknown): Promise<{
		verified: boolean;
		info?: IJsonLdNodeObject[];
		failures?: IError[];
	}> {
		const info: IJsonLdNodeObject[] = [];
		const failures: IError[] = [];

		if (Is.stringValue(payload)) {
			const jwt = await Jwt.decode(payload);

			if (
				Is.objectValue(jwt.header) &&
				Is.objectValue(jwt.payload) &&
				Is.uint8Array(jwt.signature)
			) {
				try {
					const expiredMs = (Coerce.number(jwt.payload.exp) ?? 0) * 1000;
					if (expiredMs > 0 && expiredMs < Date.now()) {
						failures.push(
							new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenExpired")
						);
					}

					const verificationResult =
						await this._identityComponent.verifiableCredentialVerify(payload);

					const verifiableCredential = verificationResult.verifiableCredential;
					if (Is.empty(verifiableCredential)) {
						failures.push(
							new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingCredential")
						);
					}

					const issuer: string | undefined = Is.stringValue(verifiableCredential?.issuer)
						? verifiableCredential?.issuer
						: undefined;
					if (Is.empty(issuer)) {
						failures.push(
							new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingIssuer")
						);
					}

					const subject = verifiableCredential?.credentialSubject;
					if (Is.empty(subject)) {
						failures.push(
							new GeneralError(JwtVerifiableCredentialVerifier.CLASS_NAME, "tokenMissingSubject")
						);
					} else {
						const subjectArray = Array.isArray(subject) ? subject : [subject];
						info.push(...subjectArray);
					}
				} catch (err) {
					failures.push(BaseError.fromError(err));
				}
			}
		}

		return {
			verified: failures.length === 0,
			info,
			failures
		};
	}
}
