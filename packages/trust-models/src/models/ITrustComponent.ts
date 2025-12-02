// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent, IError } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";

/**
 * Interface describing a trust component.
 */
export interface ITrustComponent extends IComponent {
	/**
	 * Verify a payload by checking the validity of its structure and content using the registered verifiers.
	 * @param payload The payload to verify.
	 * @param overrideVerifiers List of verifiers to use instead of the default ones.
	 * @returns Whether the payload is verified and any additional information extracted from the payload, or failures per verifier.
	 */
	verify(
		payload: unknown,
		overrideVerifiers?: string[]
	): Promise<{
		verified: boolean;
		info?: IJsonLdNodeObject[];
		failures?: { [id: string]: IError[] };
	}>;
}
