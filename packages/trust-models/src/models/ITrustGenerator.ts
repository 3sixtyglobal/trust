// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IComponent } from "@twin.org/core";

/**
 * Interface describing a trust generator component.
 */
export interface ITrustGenerator extends IComponent {
	/**
	 * Generate a trust payload.
	 * @param info Information to use in the generation.
	 * @returns The generated payload.
	 */
	generate(info?: { [key: string]: unknown }): Promise<unknown>;
}
