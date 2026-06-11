// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, Guards, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import { DocumentHelper, type IIdentityComponent } from "@twin.org/identity-models";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { ITrustGenerator } from "@twin.org/trust-models";
import type { IJwtVerifiableCredentialGeneratorConstructorOptions } from "../models/IJwtVerifiableCredentialGeneratorConstructorOptions.js";

/**
 * Class to generate a JWT Verifiable Credential.
 */
export class JwtVerifiableCredentialGenerator implements ITrustGenerator {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<JwtVerifiableCredentialGenerator>();

	/**
	 * The logging component.
	 * @internal
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members
	private readonly _loggingComponent?: ILoggingComponent;

	/**
	 * The identity component.
	 * @internal
	 */
	private readonly _identityComponent: IIdentityComponent;

	/**
	 * The verification method ID for the connector to use.
	 * @internal
	 */
	private readonly _verificationMethodId: string;

	/**
	 * The time-to-live (TTL) for token in seconds.
	 * @internal
	 */
	private readonly _tokenTtlInSeconds?: number;

	/**
	 * Create a new instance of JwtVerifiableCredentialGenerator.
	 * @param options The options for the service.
	 */
	constructor(options: IJwtVerifiableCredentialGeneratorConstructorOptions) {
		this._loggingComponent = ComponentFactory.getIfExists(options?.loggingComponentType);

		this._identityComponent = ComponentFactory.get(options?.identityComponentType ?? "identity");

		this._verificationMethodId = options.config.verificationMethodId;
		this._tokenTtlInSeconds = options.config.tokenTtlInSeconds;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return JwtVerifiableCredentialGenerator.CLASS_NAME;
	}

	/**
	 * Generate a trust payload.
	 * @param organizationId The identity for which to generate the payload.
	 * @param info Information to use in the generation.
	 * @param info.subject The subject of the verifiable credential (JSON-LD).
	 * the JWT payload as the `org` claim.
	 * @param options Per-call generation options.
	 * @param options.tokenTtlInSeconds TTL override in seconds for this token only. Takes precedence over the
	 * config-level `tokenTtlInSeconds` when provided.
	 * @returns The generated JWT.
	 */
	public async generate(
		organizationId: string,
		info?: { subject?: IJsonLdNodeObject },
		options?: { tokenTtlInSeconds: number }
	): Promise<unknown> {
		Guards.stringValue(
			JwtVerifiableCredentialGenerator.CLASS_NAME,
			nameof(organizationId),
			organizationId
		);

		const ttlInSeconds = Is.integer(options?.tokenTtlInSeconds)
			? options.tokenTtlInSeconds
			: this._tokenTtlInSeconds;

		let expirationDate;

		if (Is.integer(ttlInSeconds)) {
			const ttlMs = ttlInSeconds * 1000;
			expirationDate = new Date(Date.now() + ttlMs);
		}

		const credential = await this._identityComponent.verifiableCredentialCreate(
			DocumentHelper.joinId(organizationId, this._verificationMethodId),
			undefined,
			// Identity subject can not be empty object
			info?.subject ?? { id: organizationId },
			{
				expirationDate
			},
			organizationId
		);

		return credential.jwt;
	}
}
