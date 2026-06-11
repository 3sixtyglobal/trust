// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";

/**
 * Interface describing a trust verifier information.
 */
export interface ITrustVerificationInfo {
	/**
	 * The organization identity associated with the payload.
	 */
	identity: string;

	/**
	 * Additional JSON-LD node objects associated with the verification.
	 */
	data?: {
		[key: string]: IJsonLdNodeObject;
	};
}
