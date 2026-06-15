// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, Guards, Is, type IError } from "@twin.org/core";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import {
	type ITrustVerificationInfo,
	TrustGeneratorFactory,
	TrustVerifierFactory,
	type ITrustComponent
} from "@twin.org/trust-models";
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
	 * The default generator type.
	 * @internal
	 */
	private readonly _defaultGeneratorType?: string;

	/**
	 * Creates a new instance of TrustService.
	 * @param options The options for the service.
	 */
	constructor(options?: ITrustServiceConstructorOptions) {
		this._loggingComponent = ComponentFactory.getIfExists(options?.loggingComponentType);

		this._defaultGeneratorType = options?.config?.defaultGeneratorType;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The runtime class name string
	 */
	public className(): string {
		return TrustService.CLASS_NAME;
	}

	/**
	 * Verifies a payload using all registered verifiers or an explicit override list.
	 * @param payload The payload to verify.
	 * @param overrideVerifiers List of verifiers to use instead of the registered defaults.
	 * @returns A promise that resolves to the verification result, including the verified flag, extracted info, and any errors.
	 */
	public async verify(
		payload: unknown,
		overrideVerifiers?: string[]
	): Promise<{
		verified: boolean;
		info?: ITrustVerificationInfo;
		errors?: IError[];
	}> {
		const verifierNames = overrideVerifiers ?? TrustVerifierFactory.names();

		let verified = false;
		const info: ITrustVerificationInfo = { identity: "" };
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

		if (verifierNames.length === 0) {
			errors.push(new GeneralError(TrustService.CLASS_NAME, "noVerifiersRegistered"));
		} else {
			for (const verifierName of verifierNames) {
				const verifier = TrustVerifierFactory.get(verifierName);
				const verifierResult = await verifier.verify(payload, info, errors);

				if (!Is.empty(verifierResult)) {
					verified = verifierResult;
				}
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
			info: info.identity.length > 0 ? info : undefined,
			errors: errors.length > 0 ? errors : undefined
		};
	}

	/**
	 * Generates a trust payload using the specified or default generator.
	 * @param identity The identity for which to generate the payload.
	 * @param generatorType The generator type to use; falls back to the configured default or the first registered generator.
	 * @param info Optional information to include in the generated payload.
	 * @param options Per-call generation options.
	 * @param options.tokenTtlInSeconds TTL override in seconds for this token only; takes precedence over the config-level value when provided.
	 * @returns A promise that resolves to the generated payload.
	 * @throws GeneralError if no generators are registered.
	 */
	public async generate(
		identity: string,
		generatorType?: string,
		info?: {
			[key: string]: unknown;
		},
		options?: { tokenTtlInSeconds: number }
	): Promise<unknown> {
		Guards.stringValue(TrustService.CLASS_NAME, nameof(identity), identity);

		if (Is.empty(generatorType)) {
			generatorType = this._defaultGeneratorType;

			if (Is.empty(generatorType)) {
				const names = TrustGeneratorFactory.names();
				if (names.length === 0) {
					throw new GeneralError(TrustService.CLASS_NAME, "noGeneratorsRegistered");
				}
				generatorType = names[0];
			}
		}

		const generator = TrustGeneratorFactory.get(generatorType);

		return generator.generate(identity, info, options);
	}
}
