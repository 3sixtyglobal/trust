// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The options for the JWT Verifiable Credential Generator.
 */
export interface IJwtVerifiableCredentialGeneratorConfig {
	/**
	 * The time-to-live (TTL) for token in seconds.
	 * @default 60 (1 minute)
	 */
	tokenTtlInSeconds?: number;

	/**
	 * The id of the identity method to use when creating/verifying tokens.
	 */
	verificationMethodId: string;
}
