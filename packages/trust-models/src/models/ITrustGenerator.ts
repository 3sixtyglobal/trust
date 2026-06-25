// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing a trust generator component.
 */
export interface ITrustGenerator extends IComponent {
	/**
	 * Generate a trust payload.
	 * @param identity The identity for which to generate the payload.
	 * @param info Information to use in the generation.
	 * @param options Per-call generation options.
	 * @param options.tokenTtlInSeconds TTL override in seconds for this token only.
	 * @returns The generated payload.
	 */
	generate(
		identity: string,
		info?: { [key: string]: unknown },
		options?: { tokenTtlInSeconds: number }
	): Promise<unknown>;
}
