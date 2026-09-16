// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";

/**
 * The outcome of verifying a JWT, held in the verifier cache.
 */
export interface IJwtVerificationCacheEntry {
	/**
	 * Whether the payload is verified.
	 */
	verified: boolean;

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
