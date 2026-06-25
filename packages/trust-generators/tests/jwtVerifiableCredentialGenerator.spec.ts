// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { IIdentityComponent } from "@twin.org/identity-models";
import { JwtVerifiableCredentialGenerator } from "../src/generators/jwtVerifiableCredentialGenerator.js";
import type { IJwtVerifiableCredentialGeneratorConstructorOptions } from "../src/models/IJwtVerifiableCredentialGeneratorConstructorOptions.js";

// Mock identity component
const mockIdentityComponent = {
	verifiableCredentialCreate: vi.fn()
};

describe("JwtVerifiableCredentialGenerator", () => {
	beforeEach(() => {
		ComponentFactory.register(
			"identity",
			() => mockIdentityComponent as unknown as IIdentityComponent
		);
		mockIdentityComponent.verifiableCredentialCreate.mockReset();
	});

	it("should instantiate with default options", () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		expect(generator).toBeInstanceOf(JwtVerifiableCredentialGenerator);
	});

	it("should throw if required options are missing", () => {
		expect(
			() =>
				new JwtVerifiableCredentialGenerator({
					identityComponentType: "identity"
				} as IJwtVerifiableCredentialGeneratorConstructorOptions)
		).toThrow();
	});

	it("should call verifiableCredentialCreate when generating", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		const mockCredential = { jwt: "jwt-token" };
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue(mockCredential);
		const subject = { id: "did:example:456", foo: "bar" };
		const result = await generator.generate("did:example:123", { subject });
		expect(mockIdentityComponent.verifiableCredentialCreate).toHaveBeenCalled();
		expect(result).toBe(mockCredential.jwt);
	});

	it("falls back to the organization id subject when no info is provided", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		await generator.generate("did:example:123");

		const subjectArg = mockIdentityComponent.verifiableCredentialCreate.mock.calls[0][2];
		expect(subjectArg).toEqual({ id: "did:example:123" });
	});

	it("falls back to the organization id subject when the subject is an empty object", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		await generator.generate("did:example:123", { subject: {} });

		const subjectArg = mockIdentityComponent.verifiableCredentialCreate.mock.calls[0][2];
		expect(subjectArg).toEqual({ id: "did:example:123" });
	});

	it("uses the provided subject when it has at least one property", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });
		const subject = { id: "did:example:456", foo: "bar" };

		await generator.generate("did:example:123", { subject });

		const subjectArg = mockIdentityComponent.verifiableCredentialCreate.mock.calls[0][2];
		expect(subjectArg).toEqual(subject);
	});

	it("uses constructor tokenTtlInSeconds when no per-call override is provided", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1", tokenTtlInSeconds: 300 }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		const before = Date.now();
		await generator.generate("did:example:123");
		const after = Date.now();

		const calls = mockIdentityComponent.verifiableCredentialCreate.mock.calls;
		const vcOptionsArg = calls[0][3];
		const expiration: Date = vcOptionsArg.expirationDate;
		expect(expiration).toBeInstanceOf(Date);
		const windowTtl = 300 * 1000;
		expect(expiration.getTime()).toBeGreaterThanOrEqual(before + windowTtl);
		expect(expiration.getTime()).toBeLessThanOrEqual(after + windowTtl);
	});

	it("uses per-call tokenTtlInSeconds override instead of constructor default", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1", tokenTtlInSeconds: 300 }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		const before = Date.now();
		await generator.generate("did:example:123", undefined, {
			tokenTtlInSeconds: 60
		});
		const after = Date.now();

		const calls = mockIdentityComponent.verifiableCredentialCreate.mock.calls;
		const vcOptionsArg = calls[0][3];
		const expiration: Date = vcOptionsArg.expirationDate;
		expect(expiration).toBeInstanceOf(Date);
		const windowTtl = 60 * 1000;
		expect(expiration.getTime()).toBeGreaterThanOrEqual(before + windowTtl);
		expect(expiration.getTime()).toBeLessThanOrEqual(after + windowTtl);
	});

	it("does not set expirationDate when no TTL is configured and no per-call override is given", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		await generator.generate("did:example:123");

		const calls = mockIdentityComponent.verifiableCredentialCreate.mock.calls;
		const vcOptionsArg = calls[0][3];
		expect(vcOptionsArg.expirationDate).toBeUndefined();
	});

	it("should handle errors from identity component", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockRejectedValue(new Error("fail"));
		const subject = { id: "did:example:456", foo: "bar" };
		await expect(generator.generate("did:example:123", { subject })).rejects.toThrow("fail");
	});
});
