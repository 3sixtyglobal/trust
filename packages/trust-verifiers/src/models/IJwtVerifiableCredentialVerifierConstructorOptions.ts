// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * The options for the JWT Verifiable Credential Verifier.
 */
export interface IJwtVerifiableCredentialVerifierConstructorOptions {
	/**
	 * The logging component type.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The identity component type.
	 * @default identity
	 */
	identityComponentType?: string;
}
