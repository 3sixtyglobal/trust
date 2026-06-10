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
		this._loggingComponent = ComponentFactory.getIfExists(
			options?.loggingComponentType ?? "logging"
		);

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
	 * @param identity The identity for which to generate the payload.
	 * @param info Information to use in the generation.
	 * @param info.subject The subject of the verifiable credential (JSON-LD).
	 * @param tenantIdHash Optional tenant identifier, should be an opaque hashed version. Embedded directly in the JWT as the tid claim.
	 * @param organizationId Optional organization identifier. Embedded directly in
	 * the JWT payload as the `org` claim.
	 * @param options Per-call generation options.
	 * @param options.tokenTtlInSeconds TTL override in seconds for this token only. Takes precedence over the
	 * config-level `tokenTtlInSeconds` when provided.
	 * @returns The generated JWT.
	 */
	public async generate(
		identity: string,
		info?: { subject?: IJsonLdNodeObject },
		tenantIdHash?: string,
		organizationId?: string,
		options?: { tokenTtlInSeconds: number }
	): Promise<unknown> {
		Guards.stringValue(JwtVerifiableCredentialGenerator.CLASS_NAME, nameof(identity), identity);

		const ttlInSeconds = Is.integer(options?.tokenTtlInSeconds)
			? options.tokenTtlInSeconds
			: this._tokenTtlInSeconds;

		let expirationDate;

		if (Is.integer(ttlInSeconds)) {
			const ttlMs = ttlInSeconds * 1000;
			expirationDate = new Date(Date.now() + ttlMs);
		}

		const jwtPayloadFields: { [key: string]: string } = {};
		if (Is.stringValue(tenantIdHash)) {
			jwtPayloadFields.tid = tenantIdHash;
		}
		if (Is.stringValue(organizationId)) {
			jwtPayloadFields.org = organizationId;
		}

		const issuer = DocumentHelper.joinId(identity, this._verificationMethodId);

		const credential = await this._identityComponent.verifiableCredentialCreate(
			issuer,
			undefined,
			info?.subject ?? { id: issuer },
			{
				expirationDate,
				jwtPayloadFields
			},
			identity
		);

		return credential.jwt;
	}
}
