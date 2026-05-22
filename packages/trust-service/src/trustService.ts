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
	 * Create a new instance of TrustService.
	 * @param options The options for the service.
	 */
	constructor(options?: ITrustServiceConstructorOptions) {
		this._loggingComponent = ComponentFactory.getIfExists(
			options?.loggingComponentType ?? "logging"
		);

		this._defaultGeneratorType = options?.config?.defaultGeneratorType;
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
	 * Generate a payload using the specified generators.
	 * @param identity The identity for which to generate the payload.
	 * @param generatorType The type of generator to use, defaults to the default generator type or first in factory.
	 * @param info Optional information to include in the generated payload.
	 * @param tenantId Optional tenant identifier to embed in the payload.
	 * @param organizationId Optional organization identifier to embed in the payload.
	 * @returns The generated payload.
	 */
	public async generate(
		identity: string,
		generatorType?: string,
		info?: {
			[key: string]: unknown;
		},
		tenantId?: string,
		organizationId?: string
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

		return generator.generate(identity, info, tenantId, organizationId);
	}
}
