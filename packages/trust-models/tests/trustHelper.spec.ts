// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { TrustHelper } from "../src/helpers/trustHelper.js";
import type { ITrustComponent } from "../src/models/ITrustComponent.js";
import type { ITrustVerificationInfo } from "../src/models/ITrustVerificationInfo.js";

const mockVerificationInfo: ITrustVerificationInfo = {
	identity: "did:example:123"
};

function makeMockComponent(result: {
	verified: boolean;
	info?: ITrustVerificationInfo;
	errors?: Error[];
}): ITrustComponent {
	return {
		CLASS_NAME: "MockTrustComponent",
		className: () => "MockTrustComponent",
		verify: vi.fn().mockResolvedValue(result),
		generate: vi.fn()
	} as unknown as ITrustComponent;
}

describe("TrustHelper", () => {
	describe("verifyTrust", () => {
		it("returns trust info when verification succeeds", async () => {
			const component = makeMockComponent({ verified: true, info: mockVerificationInfo });
			const result = await TrustHelper.verifyTrust(component, "payload", "read");
			expect(result).toBe(mockVerificationInfo);
		});

		it("passes the trustPayload and overrideVerifiers to component.verify", async () => {
			const component = makeMockComponent({ verified: true, info: mockVerificationInfo });
			const overrideVerifiers = ["verifier-a"];
			await TrustHelper.verifyTrust(component, "my-payload", "read", overrideVerifiers);
			expect(component.verify).toHaveBeenCalledWith("my-payload", overrideVerifiers);
		});

		it("throws UnauthorizedError when verified is false", async () => {
			const component = makeMockComponent({ verified: false });
			await expect(TrustHelper.verifyTrust(component, "payload", "write")).rejects.toMatchObject({
				name: "UnauthorizedError"
			});
		});

		it("throws UnauthorizedError when verified is true but identity is missing", async () => {
			const component = makeMockComponent({
				verified: true,
				info: { identity: "" }
			});
			await expect(TrustHelper.verifyTrust(component, "payload", "write")).rejects.toMatchObject({
				name: "UnauthorizedError"
			});
		});

		it("throws UnauthorizedError when verified is true but info is undefined", async () => {
			const component = makeMockComponent({ verified: true, info: undefined });
			await expect(TrustHelper.verifyTrust(component, "payload", "write")).rejects.toMatchObject({
				name: "UnauthorizedError"
			});
		});

		it("includes errors in the thrown exception", async () => {
			const component = makeMockComponent({
				verified: false,
				errors: [new Error("token expired")]
			});
			await expect(TrustHelper.verifyTrust(component, "payload", "delete")).rejects.toMatchObject({
				name: "UnauthorizedError"
			});
		});

		it("does not include stack traces in error details by default", async () => {
			const component = makeMockComponent({
				verified: false,
				errors: [new Error("some error")]
			});
			let thrown: unknown;
			try {
				await TrustHelper.verifyTrust(component, "payload", "read");
			} catch (e) {
				thrown = e;
			}
			expect(JSON.stringify(thrown)).not.toContain("stack");
		});

		it("includes stack traces in error details when includeErrorDetails is true", async () => {
			const component = makeMockComponent({
				verified: false,
				errors: [new Error("some error")]
			});
			let thrown: unknown;
			try {
				await TrustHelper.verifyTrust(component, "payload", "read", undefined, true);
			} catch (e) {
				thrown = e;
			}
			expect(JSON.stringify(thrown)).toContain("stack");
		});
	});
});
