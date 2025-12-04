// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, type IError, Is } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import { TrustVerifierFactory, type ITrustComponent } from "@twin.org/trust-models";
import type { ITrustServiceConstructorOptions } from "./models/ITrustServiceConstructorOptions.js";

/**
 * Class for performing trust operations.
 */
export class TrustService implements ITrustComponent {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<TrustService>();

	/**
	 * The logging component.
	 * @internal
	 */
	private readonly _loggingComponent?: ILoggingComponent;

	/**
	 * Create a new instance of TrustService.
	 * @param options The options for the service.
	 */
	constructor(options?: ITrustServiceConstructorOptions) {
		this._loggingComponent = ComponentFactory.getIfExists(
			options?.loggingComponentType ?? "logging"
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return TrustService.CLASS_NAME;
	}

	/**
	 * Verify a payload by checking the validity of its structure and content using the registered verifiers.
	 * @param payload The payload to verify.
	 * @param overrideVerifiers List of verifiers to use instead of the default ones.
	 * @returns Whether the payload is verified and any additional information extracted from the payload, or verification errors.
	 */
	public async verify(
		payload: unknown,
		overrideVerifiers?: string[]
	): Promise<{
		verified: boolean;
		info?: IJsonLdNodeObject[];
		errors?: IError[];
	}> {
		const verifierNames = overrideVerifiers ?? TrustVerifierFactory.names();
		let verified = false;
		const info: IJsonLdNodeObject[] = [];
		const errors: IError[] = [];

		await this._loggingComponent?.log({
			level: "info",
			source: TrustService.CLASS_NAME,
			message: "verifying",
			ts: Date.now(),
			data: {
				payload: payload?.toString() ?? ""
			}
		});

		for (const verifierName of verifierNames) {
			const verifier = TrustVerifierFactory.get(verifierName);
			const verifierResult = await verifier.verify(payload, info, errors);

			if (!Is.empty(verifierResult)) {
				verified = verifierResult;
			}
		}

		if (verified) {
			await this._loggingComponent?.log({
				level: "info",
				source: TrustService.CLASS_NAME,
				message: "verified",
				ts: Date.now(),
				data: {
					info
				}
			});
		} else {
			await this._loggingComponent?.log({
				level: "error",
				source: TrustService.CLASS_NAME,
				message: "notVerified",
				ts: Date.now(),
				data: {
					errors
				}
			});
		}

		return {
			verified,
			info: info.length > 0 ? info : undefined,
			errors: errors.length > 0 ? errors : undefined
		};
	}
}
