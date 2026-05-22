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

	it("passes tenantId + organizationId as jwtPayloadFields (tid + org) to the identity connector", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		await generator.generate(
			"did:example:123",
			{ subject: { id: "did:example:456" } },
			"tenant-a",
			"did:iota:org-a"
		);

		const calls = mockIdentityComponent.verifiableCredentialCreate.mock.calls;
		const subjectArg = calls[0][2];
		const optionsArg = calls[0][3];
		expect(subjectArg).toEqual({ id: "did:example:456" });
		expect(optionsArg).toMatchObject({
			jwtPayloadFields: {
				tid: "tenant-a",
				org: "did:iota:org-a"
			}
		});
	});

	it("passes an empty jwtPayloadFields object when neither tenantId nor organizationId is provided", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		await generator.generate("did:example:123", { subject: { id: "did:example:456" } });

		const calls = mockIdentityComponent.verifiableCredentialCreate.mock.calls;
		const optionsArg = calls[0][3];
		expect(optionsArg.jwtPayloadFields).toEqual({});
	});

	it("includes only tid in jwtPayloadFields when only tenantId is provided", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		await generator.generate("did:example:123", { subject: { id: "did:example:456" } }, "tenant-a");

		const calls = mockIdentityComponent.verifiableCredentialCreate.mock.calls;
		const optionsArg = calls[0][3];
		expect(optionsArg.jwtPayloadFields).toEqual({ tid: "tenant-a" });
	});

	it("includes only org in jwtPayloadFields when only organizationId is provided", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		await generator.generate(
			"did:example:123",
			{ subject: { id: "did:example:456" } },
			undefined,
			"did:iota:org-a"
		);

		const calls = mockIdentityComponent.verifiableCredentialCreate.mock.calls;
		const optionsArg = calls[0][3];
		expect(optionsArg.jwtPayloadFields).toEqual({ org: "did:iota:org-a" });
	});

	it("does not merge tenantId or organizationId into the credentialSubject", async () => {
		const generator = new JwtVerifiableCredentialGenerator({
			identityComponentType: "identity",
			config: { verificationMethodId: "did:example:123#key-1" }
		});
		mockIdentityComponent.verifiableCredentialCreate.mockResolvedValue({ jwt: "jwt-token" });

		await generator.generate(
			"did:example:123",
			{ subject: { id: "did:example:456", domain: "data" } },
			"tenant-a",
			"did:iota:org-a"
		);

		const calls = mockIdentityComponent.verifiableCredentialCreate.mock.calls;
		const subjectArg = calls[0][2];
		expect(subjectArg).toEqual({ id: "did:example:456", domain: "data" });
		expect(subjectArg.tenantId).toBeUndefined();
		expect(subjectArg.organizationId).toBeUndefined();
		expect(subjectArg.tid).toBeUndefined();
		expect(subjectArg.org).toBeUndefined();
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
