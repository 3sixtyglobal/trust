// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IIdentityAllowDenyVerifierConfig } from "./IIdentityAllowDenyVerifierConfig.js";

/**
 * The options for the Identity Allow/Deny Verifier.
 */
export interface IIdentityAllowDenyVerifierConstructorOptions {
	/**
	 * The allow/deny configuration for the verifier.
	 */
	config?: IIdentityAllowDenyVerifierConfig;
}
