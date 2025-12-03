// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent, IError } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";

/**
 * Interface describing a trust verifier component.
 */
export interface ITrustVerifier extends IComponent {
	/**
	 * Verify a payload by checking the validity of its structure and content.
	 * @param payload The payload to verify.
	 * @param info Information extracted from previous verifiers and to be added by this verifier.
	 * @returns Whether the payload is verified and possible verification failures, returns undefined if payload not processed.
	 */
	verify(
		payload: unknown,
		info: IJsonLdNodeObject[]
	): Promise<
		| {
				verified: boolean;
				failures?: IError[];
		  }
		| undefined
	>;
}
