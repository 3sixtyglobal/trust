// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { IJwtVerifiableCredentialGeneratorConfig } from "./IJwtVerifiableCredentialGeneratorConfig.js";

/**
 * The options for the JWT Verifiable Credential Generator.
 */
export interface IJwtVerifiableCredentialGeneratorConstructorOptions {
	/**
	 * The logging component type.
	 */
	loggingComponentType?: string;

	/**
	 * The identity component type.
	 * @default identity
	 */
	identityComponentType?: string;

	/**
	 * The configuration for the generator.
	 */
	config: IJwtVerifiableCredentialGeneratorConfig;
}
