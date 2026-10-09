// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@3sixty/core";
import type { IJsonLdNodeObject } from "@3sixty/data-json-ld";

/**
 * The outcome of verifying a JWT, held in the verifier cache.
 */
export interface IJwtVerificationCacheEntry {
	/**
	 * Whether the payload is verified.
	 */
	verified: boolean;

	/**
	 * Whether the verification ran to completion. False when the identity component threw, as the
	 * outcome is then not a verdict on the token, and only a completed verification is cached.
	 */
	completed: boolean;

	/**
	 * The errors collected during the verification.
	 */
	errors: IError[];

	/**
	 * The identity to associate with the payload, undefined when the credential had no issuer.
	 */
	identity?: string;

	/**
	 * The data to associate with the payload.
	 */
	data?: {
		[key: string]: IJsonLdNodeObject;
	};
}
