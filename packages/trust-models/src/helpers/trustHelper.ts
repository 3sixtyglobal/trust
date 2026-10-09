// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, Is, UnauthorizedError } from "@3sixty/core";
import { nameof } from "@3sixty/nameof";
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
	 * Verifies the trust payload for the action, throwing if verification fails.
	 * @param component The trust component to use.
	 * @param trustPayload The trust payload to verify.
	 * @param action The action being performed.
	 * @param overrideVerifiers List of verifiers to use instead of the default ones.
	 * @param includeErrorDetails Whether to include detailed error information in the exception if verification fails.
	 * @returns A promise that resolves to the verified trust information.
	 * @throws UnauthorizedError if the payload cannot be verified or the identity is missing.
	 */
	public static async verifyTrust(
		component: ITrustComponent,
		trustPayload: unknown,
		action: string,
		overrideVerifiers?: string[],
		includeErrorDetails: boolean = false
	): Promise<ITrustVerificationInfo> {
		const trustResult = await component.verify(trustPayload, overrideVerifiers);
		if (!trustResult.verified || !Is.stringValue(trustResult.info?.identity)) {
			throw new UnauthorizedError(TrustHelper.CLASS_NAME, "trustVerifyFailed", {
				action,
				errors:
					trustResult.errors?.map(error =>
						BaseError.fromError(error).toJsonObject(includeErrorDetails)
					) ?? []
			});
		}
		return trustResult.info;
	}
}
