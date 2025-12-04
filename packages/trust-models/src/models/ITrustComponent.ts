// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent, IError } from "@twin.org/core";

/**
 * Interface describing a trust component.
 */
export interface ITrustComponent extends IComponent {
	/**
	 * Verify a payload by checking the validity of its structure and content using the registered verifiers.
	 * @param payload The payload to verify.
	 * @param overrideVerifiers List of verifiers to use instead of the default ones.
	 * @returns Whether the payload is verified and any additional information extracted from the payload, or errors.
	 */
	verify(
		payload: unknown,
		overrideVerifiers?: string[]
	): Promise<{
		verified: boolean;
		info?: { [key: string]: unknown };
		errors?: IError[];
	}>;

	/**
	 * Generate a payload using the specified generators.
	 * @param generatorType The type of generator to use.
	 * @param info Optional information to include in the generated payload.
	 * @returns The generated payload.
	 */
	generate(generatorType: string, info?: { [key: string]: unknown }): Promise<unknown>;
}
