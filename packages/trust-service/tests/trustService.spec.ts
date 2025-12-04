// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory, type IError } from "@twin.org/core";
import type { ITrustVerifier, ITrustGenerator } from "@twin.org/trust-models";
import { TrustVerifierFactory, TrustGeneratorFactory } from "@twin.org/trust-models";
import { TrustService } from "../src/trustService.js";

describe("TrustService", () => {
	beforeEach(() => {
		Factory.clearFactories();
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

	test("generate returns payload from mock generator", async () => {
		const mockPayload = { success: true };
		const mockGenerator: ITrustGenerator = {
			generate: async (identity: string, info?: { [key: string]: unknown }) => ({
				...mockPayload,
				identity,
				info
			}),
			className: () => "MockGenerator"
		};
		TrustGeneratorFactory.register("mockGenerator", () => mockGenerator);

		const trustService = new TrustService();
		const result = await trustService.generate("test-id", "mockGenerator", { foo: "bar" });
		expect(result).toMatchObject({ success: true, identity: "test-id", info: { foo: "bar" } });

		TrustGeneratorFactory.unregister("mockGenerator");
	});

	test("generate throws error if no generators registered", async () => {
		// Unregister all generators
		const names = TrustGeneratorFactory.names();
		names.forEach(name => TrustGeneratorFactory.unregister(name));

		const trustService = new TrustService();
		await expect(trustService.generate("test-id")).rejects.toThrow(/noGeneratorsRegistered/);
	});

	test("generate uses first registered generator if type not provided", async () => {
		const mockPayload = { ok: true };
		const mockGenerator: ITrustGenerator = {
			generate: async (identity: string, info?: { [key: string]: unknown }) => ({
				...mockPayload,
				identity
			}),
			className: () => "MockGenerator"
		};
		TrustGeneratorFactory.register("mockGenerator", () => mockGenerator);

		const trustService = new TrustService();
		const result = await trustService.generate("default-id");
		expect(result).toMatchObject({ ok: true, identity: "default-id" });

		TrustGeneratorFactory.unregister("mockGenerator");
	});

	test("generate throws error for invalid identity", async () => {
		const mockGenerator: ITrustGenerator = {
			generate: async (_identity: string, _info?: { [key: string]: unknown }) => ({}),
			className: () => "MockGenerator"
		};
		TrustGeneratorFactory.register("mockGenerator", () => mockGenerator);

		const trustService = new TrustService();
		// Pass empty string instead of undefined to trigger validation error
		await expect(trustService.generate("", "mockGenerator")).rejects.toThrow();

		TrustGeneratorFactory.unregister("mockGenerator");
	});
});
