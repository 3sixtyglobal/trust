// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, type IError } from "@twin.org/core";
import type { IIdentityComponent } from "@twin.org/identity-models";
import type { ITrustVerificationInfo } from "@twin.org/trust-models";
import { Jwt } from "@twin.org/web";
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
			payload.header,
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
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(true);
		expect(info.data?.subject).toEqual({
			id: "subject"
		});
		expect(info.data?.verifiableCredential).toEqual({
			credentialSubject: {
				id: "subject"
			},
			issuer: "issuer"
		});
	});

	it("should verify a valid JWT with no expiration", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: {}
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
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
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(true);
		expect(info.data?.subject).toEqual({
			id: "subject"
		});
		expect(info.data?.verifiableCredential).toEqual({
			credentialSubject: {
				id: "subject"
			},
			issuer: "issuer"
		});
	});

	it("should fail verification for expired JWT", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) - 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
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
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(false);
		expect(errors.some((f: IError) => f.message?.includes("tokenExpired"))).toBe(true);
	});

	it("should fail verification for missing credential", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: undefined
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(false);
		expect(errors.some((f: IError) => f.message?.includes("tokenMissingCredential"))).toBe(true);
	});

	it("should fail verification for missing issuer", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
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
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(false);
		expect(errors.some((f: IError) => f.message?.includes("tokenMissingIssuer"))).toBe(true);
	});

	it("should extract tid and org from the JWT payload onto info.tenantId / info.organizationId", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: {
				exp: Math.floor(Date.now() / 1000) + 1000,
				tid: "tenant-a",
				org: "did:iota:org-a"
			}
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: "did:iota:node",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(true);
		expect(info.tenantId).toBe("tenant-a");
		expect(info.organizationId).toBe("did:iota:org-a");
	});

	it("should extract only tenantId when the JWT payload carries tid but not org", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: {
				exp: Math.floor(Date.now() / 1000) + 1000,
				tid: "tenant-a"
			}
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: "did:iota:node",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(true);
		expect(info.tenantId).toBe("tenant-a");
		expect(info.organizationId).toBeUndefined();
	});

	it("should extract only organizationId when the JWT payload carries org but not tid", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: {
				exp: Math.floor(Date.now() / 1000) + 1000,
				org: "did:iota:org-a"
			}
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: "did:iota:node",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(true);
		expect(info.tenantId).toBeUndefined();
		expect(info.organizationId).toBe("did:iota:org-a");
	});

	it("should leave tenantId and organizationId unset when the JWT payload omits tid and org", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: "did:iota:node",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(true);
		expect(info.tenantId).toBeUndefined();
		expect(info.organizationId).toBeUndefined();
	});

	it("should ignore tenantId / organizationId nested in credentialSubject (legacy-format anti-regression)", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
			payload.payload,
			async (signHeader, signPayload) =>
				Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
		);
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async jwtString => ({
			verifiableCredential: {
				issuer: "did:iota:node",
				credentialSubject: {
					id: "subject",
					tenantId: "tenant-legacy",
					organizationId: "did:iota:org-legacy"
				}
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(true);
		expect(info.tenantId).toBeUndefined();
		expect(info.organizationId).toBeUndefined();
	});

	it("should fail verification for missing subject", async () => {
		const payload = {
			header: { alg: "EdDSA" },
			payload: { exp: Math.floor(Date.now() / 1000) + 1000 }
		};
		const token = await Jwt.encodeWithSigner(
			payload.header,
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
		const info: ITrustVerificationInfo = { identity: "" };
		const errors: IError[] = [];
		const result = await verifier.verify(token, info, errors);
		expect(result).toBe(false);
		expect(errors.some((f: IError) => f.message?.includes("tokenMissingSubject"))).toBe(true);
	});
});
