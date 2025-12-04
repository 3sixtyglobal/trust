// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent, IError } from "@twin.org/core";

/**
 * Interface describing a trust verifier component.
 */
export interface ITrustVerifier extends IComponent {
	/**
	 * Verify a payload by checking the validity of its structure and content.
	 * @param payload The payload to verify.
	 * @param info Information extracted from previous verifiers and to be added by this verifier.
	 * @param errors Array to collect verification errors.
	 * @returns Whether the payload is verified, returns undefined if payload was not processed.
	 */
	verify(
		payload: unknown,
		info: {
			[key: string]: unknown;
		},
		errors: IError[]
	): Promise<boolean | undefined>;
}
