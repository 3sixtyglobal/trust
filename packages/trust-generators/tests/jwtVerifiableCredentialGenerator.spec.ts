// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory } from "@twin.org/core";
import type { IIdentityComponent } from "@twin.org/identity-models";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
		expect(result).toBe(mockCredential);
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
