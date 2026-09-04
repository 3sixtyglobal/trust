// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJwtVerifiableCredentialVerifierConfig } from "./IJwtVerifiableCredentialVerifierConfig.js";

/**
 * The options for the JWT Verifiable Credential Verifier.
 */
export interface IJwtVerifiableCredentialVerifierConstructorOptions {
	/**
	 * The identity component type.
	 * @default identity
	 */
	identityComponentType?: string;

	/**
	 * The configuration for the verifier.
	 */
	config?: IJwtVerifiableCredentialVerifierConfig;
}
