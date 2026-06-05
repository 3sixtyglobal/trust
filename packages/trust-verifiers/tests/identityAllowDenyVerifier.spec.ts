// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IError } from "@twin.org/core";
import type { ITrustVerificationInfo } from "@twin.org/trust-models";
import { IdentityAllowDenyVerifier } from "../src/verifiers/identityAllowDenyVerifier.js";

describe("IdentityAllowDenyVerifier", () => {
	const makeInfo = (identity: string): ITrustVerificationInfo => ({ identity });

	it("should return undefined when no lists are configured", async () => {
		const verifier = new IdentityAllowDenyVerifier();
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo("did:iota:abc"), errors);
		expect(result).toBeUndefined();
		expect(errors).toHaveLength(0);
	});

	it("should return false when identity is empty and lists are configured", async () => {
		const verifier = new IdentityAllowDenyVerifier({
			config: { allowIdentities: ["did:iota:abc"], denyIdentities: ["did:iota:bad"] }
		});
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo(""), errors);
		expect(result).toBe(false);
		expect(errors.some((e: IError) => e.message?.includes("identityMissing"))).toBe(true);
	});

	it("should return undefined when both lists are empty arrays", async () => {
		const verifier = new IdentityAllowDenyVerifier({
			config: { allowIdentities: [], denyIdentities: [] }
		});
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo("did:iota:abc"), errors);
		expect(result).toBeUndefined();
		expect(errors).toHaveLength(0);
	});

	it("should return true when identity is in allowIdentities", async () => {
		const verifier = new IdentityAllowDenyVerifier({
			config: { allowIdentities: ["did:iota:abc", "did:iota:def"] }
		});
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo("did:iota:abc"), errors);
		expect(result).toBe(true);
		expect(errors).toHaveLength(0);
	});

	it("should return false when identity is not in allowIdentities", async () => {
		const verifier = new IdentityAllowDenyVerifier({
			config: { allowIdentities: ["did:iota:abc"] }
		});
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo("did:iota:other"), errors);
		expect(result).toBe(false);
		expect(errors.some((e: IError) => e.message?.includes("identityNotAllowed"))).toBe(true);
	});

	it("should return true when identity is not in denyIdentities", async () => {
		const verifier = new IdentityAllowDenyVerifier({
			config: { denyIdentities: ["did:iota:bad"] }
		});
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo("did:iota:good"), errors);
		expect(result).toBe(true);
		expect(errors).toHaveLength(0);
	});

	it("should return false when identity is in denyIdentities", async () => {
		const verifier = new IdentityAllowDenyVerifier({
			config: { denyIdentities: ["did:iota:bad"] }
		});
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo("did:iota:bad"), errors);
		expect(result).toBe(false);
		expect(errors.some((e: IError) => e.message?.includes("identityDenied"))).toBe(true);
	});

	it("should return false via deny when identity passes allow but is in denyIdentities", async () => {
		const verifier = new IdentityAllowDenyVerifier({
			config: { allowIdentities: ["did:iota:abc"], denyIdentities: ["did:iota:abc"] }
		});
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo("did:iota:abc"), errors);
		expect(result).toBe(false);
		expect(errors.some((e: IError) => e.message?.includes("identityDenied"))).toBe(true);
	});

	it("should return true when identity passes both allow and deny checks", async () => {
		const verifier = new IdentityAllowDenyVerifier({
			config: {
				allowIdentities: ["did:iota:abc", "did:iota:def"],
				denyIdentities: ["did:iota:bad"]
			}
		});
		const errors: IError[] = [];
		const result = await verifier.verify(null, makeInfo("did:iota:abc"), errors);
		expect(result).toBe(true);
		expect(errors).toHaveLength(0);
	});
});
