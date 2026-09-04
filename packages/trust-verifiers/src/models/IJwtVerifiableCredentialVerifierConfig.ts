// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the JWT Verifiable Credential Verifier.
 */
export interface IJwtVerifiableCredentialVerifierConfig {
	/**
	 * Time-to-idle in milliseconds for cached verification outcomes. An entry is also given the
	 * token expiry as a hard deadline, so it is dropped at whichever comes first.
	 * Set to 0 to disable caching and decode and verify on every call.
	 * @default 5000
	 */
	verificationCacheTtiMs?: number;

	/**
	 * Maximum number of verification outcomes retained in the cache.
	 * @default 1000
	 */
	verificationCacheCapacity?: number;

	/**
	 * Maximum time in milliseconds to wait for the verification cache mutex when concurrent
	 * calls request the same credential.
	 */
	verificationCacheMutexTimeoutMs?: number;
}
