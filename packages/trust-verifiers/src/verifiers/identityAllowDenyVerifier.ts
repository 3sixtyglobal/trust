// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { GeneralError, Is, type IError } from "@twin.org/core";
import { nameof } from "@twin.org/nameof";
import type { ITrustVerificationInfo, ITrustVerifier } from "@twin.org/trust-models";
import type { IIdentityAllowDenyVerifierConstructorOptions } from "../models/IIdentityAllowDenyVerifierConstructorOptions.js";

/**
 * Class to gate verification based on allowed and denied identity lists.
 */
export class IdentityAllowDenyVerifier implements ITrustVerifier {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<IdentityAllowDenyVerifier>();

	/**
	 * The identities that are permitted.
	 * @internal
	 */
	private readonly _allowIdentities?: string[];

	/**
	 * The identities that are explicitly rejected.
	 * @internal
	 */
	private readonly _denyIdentities?: string[];

	/**
	 * Creates a new instance of IdentityAllowDenyVerifier.
	 * @param options The options for the verifier.
	 */
	constructor(options?: IIdentityAllowDenyVerifierConstructorOptions) {
		this._allowIdentities = options?.config?.allowIdentities;
		this._denyIdentities = options?.config?.denyIdentities;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The runtime class name string
	 */
	public className(): string {
		return IdentityAllowDenyVerifier.CLASS_NAME;
	}

	/**
	 * Verify a payload by checking the validity of its structure and content.
	 * @param payload The payload to verify.
	 * @param info Information extracted from previous verifiers and to be added by this verifier.
	 * @param info.identity The identity associated with the payload.
	 * @param errors Array to collect verification errors.
	 * @returns Whether the payload is verified, returns undefined if payload was not processed.
	 */
	public async verify(
		payload: unknown,
		info: ITrustVerificationInfo,
		errors: IError[]
	): Promise<boolean | undefined> {
		const hasAllow = Is.arrayValue<string>(this._allowIdentities);
		const hasDeny = Is.arrayValue<string>(this._denyIdentities);

		if (!hasAllow && !hasDeny) {
			return undefined;
		}

		if (!Is.stringValue(info.identity)) {
			errors.push(new GeneralError(IdentityAllowDenyVerifier.CLASS_NAME, "identityMissing"));
			return false;
		}

		if (hasAllow && !this._allowIdentities.includes(info.identity)) {
			errors.push(
				new GeneralError(IdentityAllowDenyVerifier.CLASS_NAME, "identityNotAllowed", {
					identity: info.identity
				})
			);
			return false;
		}

		if (hasDeny && this._denyIdentities.includes(info.identity)) {
			errors.push(
				new GeneralError(IdentityAllowDenyVerifier.CLASS_NAME, "identityDenied", {
					identity: info.identity
				})
			);
			return false;
		}

		return true;
	}
}
