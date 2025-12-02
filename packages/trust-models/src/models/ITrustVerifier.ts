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
	 * @returns Whether the payload is verified and any additional information extracted from the payload, or verification failures.
	 */
	verify(payload: unknown): Promise<{
		verified: boolean;
		info?: IJsonLdNodeObject[];
		failures?: IError[];
	}>;
}
