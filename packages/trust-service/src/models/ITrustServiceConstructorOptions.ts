// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ITrustServiceConfig } from "./ITrustServiceConfig.js";

/**
 * The options for the trust service.
 */
export interface ITrustServiceConstructorOptions {
	/**
	 * The logging component type.
	 * @default logging
	 */
	loggingComponentType?: string;

	/**
	 * The trust service configuration.
	 */
	config?: ITrustServiceConfig;
}
