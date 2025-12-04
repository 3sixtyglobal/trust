// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { UnauthorizedError } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type { ITrustComponent } from "../models/ITrustComponent.js";
import type { ITrustVerificationInfo } from "../models/ITrustVerificationInfo.js";

/**
 * Helper class for trust-related operations.
 */
export class TrustHelper {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<TrustHelper>();

	/**
	 * Verify the trust payload for the action.
	 * @param component The trust component to use.
	 * @param trustPayload The trust payload to verify.
	 * @param action The action being performed.
	 * @param overrideVerifiers List of verifiers to use instead of the default ones.
	 * @returns The information from the trust verification.
	 */
	public static async verifyTrust(
		component: ITrustComponent,
		trustPayload: unknown,
		action: string,
		overrideVerifiers?: string[]
	): Promise<ITrustVerificationInfo | undefined> {
		const trustResult = await component.verify(trustPayload, overrideVerifiers);
		if (!trustResult.verified) {
			throw new UnauthorizedError(TrustHelper.CLASS_NAME, "trustVerifyFailed", {
				action,
				errors: trustResult.errors
			});
		}
		return trustResult.info;
	}
}
