// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, type IError } from "@twin.org/core";
import type { IIdentityComponent } from "@twin.org/identity-models";
import { type IJwtHeader, Jwt } from "@twin.org/web";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { JwtVerifiableCredentialVerifier } from "../src/verifiers/jwtVerifiableCredentialVerifier.js";

// Mock identity component
const mockIdentityComponent = {
	verifiableCredentialVerify: vi.fn()
};

describe("JwtVerifiableCredentialVerifier", () => {
	beforeEach(() => {
		mockIdentityComponent.verifiableCredentialVerify.mockReset();

		ComponentFactory.register(
			"identity",
			() => mockIdentityComponent as unknown as IIdentityComponent
		);
	});

	it("should instantiate with default options", () => {
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		expect(verifier).toBeInstanceOf(JwtVerifiableCredentialVerifier);
	});

	it("should verify a valid JWT", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header as IJwtHeader,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const result = await verifier.verify(token);
		expect(result.verified).toBe(true);
		expect(result.info).toEqual([{ id: "subject" }]);
	});

	it("should fail verification for expired JWT", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) - 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header as IJwtHeader,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const result = await verifier.verify(token);
		expect(result.verified).toBe(false);
		expect(result.failures?.some((f: IError) => f.message?.includes("tokenExpired"))).toBe(true);
	});

	it("should fail verification for missing credential", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header as IJwtHeader,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: undefined
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const result = await verifier.verify(token);
		expect(result.verified).toBe(false);
		expect(
			result.failures?.some((f: IError) => f.message?.includes("tokenMissingCredential"))
		).toBe(true);
	});

	it("should fail verification for missing issuer", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header as IJwtHeader,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: undefined,
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const result = await verifier.verify(token);
		expect(result.verified).toBe(false);
		expect(result.failures?.some((f: IError) => f.message?.includes("tokenMissingIssuer"))).toBe(
			true
		);
	});

	it("should fail verification for missing subject", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header as IJwtHeader,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: undefined
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const result = await verifier.verify(token);
		expect(result.verified).toBe(false);
		expect(result.failures?.some((f: IError) => f.message?.includes("tokenMissingSubject"))).toBe(
			true
		);
	});
});
