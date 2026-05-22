// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent, IError } from "@twin.org/core";
import type { ITrustVerificationInfo } from "./ITrustVerificationInfo.js";

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
		info?: ITrustVerificationInfo;
		errors?: IError[];
	}>;

	/**
	 * Generate a payload using the specified generators.
	 * @param identity The identity for which to generate the payload.
	 * @param generatorType The type of generator to use, defaults to the default generator type or first in factory.
	 * @param info Optional information to include in the generated payload.
	 * @param tenantId Optional tenant identifier to embed in the payload.
	 * @param organizationId Optional organization identifier to embed in the payload.
	 * @returns The generated payload.
	 */
	generate(
		identity: string,
		generatorType?: string,
		info?: { [key: string]: unknown },
		tenantId?: string,
		organizationId?: string
	): Promise<unknown>;
}
