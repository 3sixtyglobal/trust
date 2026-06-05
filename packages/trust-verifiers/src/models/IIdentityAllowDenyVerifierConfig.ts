// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the Identity Allow/Deny Verifier.
 */
export interface IIdentityAllowDenyVerifierConfig {
	/**
	 * Identities that are permitted; all others are rejected.
	 * Skipped when empty or absent.
	 */
	allowIdentities?: string[];

	/**
	 * Identities that are explicitly rejected.
	 * Skipped when empty or absent.
	 */
	denyIdentities?: string[];
}
