// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@twin.org/core";
import type { ITrustVerifier } from "@twin.org/trust-models";
import { TrustVerifierFactory } from "@twin.org/trust-models";
import { TrustService } from "../src/trustService.js";

describe("TrustService", () => {
	beforeEach(() => {
		if (TrustVerifierFactory.names().includes("mockVerifier")) {
			TrustVerifierFactory.unregister("mockVerifier");
		}
		if (TrustVerifierFactory.names().includes("failVerifier")) {
			TrustVerifierFactory.unregister("failVerifier");
		}
	});

	test("can construct with dependencies", async () => {
		const trustService = new TrustService();
		expect(trustService).toBeDefined();
	});

	test("can construct with options", async () => {
		const trustService = new TrustService({ loggingComponentType: "logging" });
		expect(trustService).toBeDefined();
		expect(trustService.className()).toBe(TrustService.CLASS_NAME);
	});

	test("verify returns expected structure", async () => {
		const trustService = new TrustService();
		const result = await trustService.verify({});
		expect(result).toHaveProperty("verified");
		expect(result).toHaveProperty("info");
		expect(result).toHaveProperty("errors");
		expect(result.verified).toEqual(false);
		expect(result.info).toBeUndefined();
		expect(result.errors).toBeUndefined();
	});

	test("verify handles invalid payload gracefully", async () => {
		const trustService = new TrustService();
		const result = await trustService.verify(undefined);
		expect(result.verified).toBe(false);
	});

	test("verify with mock verifier returns true", async () => {
		const mockVerifier: ITrustVerifier = {
			verify: async (payload: unknown, info, errors) => {
				info.mock = "info";
				return true;
			},
			className: () => "MockVerifier"
		};
		TrustVerifierFactory.register("mockVerifier", () => mockVerifier);

		const trustService = new TrustService();
		const result = await trustService.verify({ test: "payload" });
		expect(result.verified).toBe(true);
		expect(result.errors).toBeUndefined();

		TrustVerifierFactory.unregister("mockVerifier");
	});

	test("verify with failing verifier returns false and errors", async () => {
		const failError: IError = {
			name: "MockError",
			source: "Mock",
			message: "Failed"
		};
		const failVerifier: ITrustVerifier = {
			verify: async (payload: unknown, info, errors) => {
				errors.push(failError);
				return false;
			},
			className: () => "FailVerifier"
		};
		TrustVerifierFactory.register("failVerifier", () => failVerifier);

		const trustService = new TrustService();
		const result = await trustService.verify({ test: "payload" });
		expect(result.verified).toBe(false);
		expect(result.info).toBeUndefined();
		expect(result.errors).toEqual([failError]);

		TrustVerifierFactory.unregister("failVerifier");
	});
});
