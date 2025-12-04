// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Interface describing a trust verifier information.
 */
export interface ITrustVerificationInfo {
	[key: string]: unknown;

	/**
	 * The identity associated with the payload.
	 */
	identity: string;
}
