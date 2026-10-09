// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ComponentFactory, GeneralError, type IError } from "@3sixty/core";
import type { IIdentityComponent } from "@3sixty/identity-models";
import type { ITrustVerificationInfo } from "@3sixty/trust-models";
import { Jwt } from "@3sixty/web";
import { JwtVerifiableCredentialVerifier } from "../src/verifiers/jwtVerifiableCredentialVerifier.js";

// Mock identity component
const mockIdentityComponent = {
	verifiableCredentialVerify: vi.fn()
};

/**
 * Create a signed JWT for the supplied payload.
 * @param jwtPayload The payload to encode.
 * @returns The encoded token.
 */
async function createToken(jwtPayload: { [id: string]: unknown }): Promise<string> {
	return Jwt.encodeWithSigner({ alg: "EdDSA" }, jwtPayload, async (signHeader, signPayload) =>
		Jwt.defaultSigner(signHeader, signPayload, new Uint8Array(32).fill(0))
	);
}

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

	it("should fail verification for a revoked credential", async () => {
		const token = await createToken({ exp: Math.floor(Date.now() / 1000) + 1000 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
			revoked: true,
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
		expect(errors.some((f: IError) => f.message?.includes("tokenRevoked"))).toBe(true);
	});

	it("should cache the verification result for repeat payloads", async () => {
		const token = await createToken({ exp: Math.floor(Date.now() / 1000) + 1000 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });

		const first = await verifier.verify(token, { identity: "" }, []);
		const second = await verifier.verify(token, { identity: "" }, []);

		expect(first).toBe(true);
		expect(second).toBe(true);
		expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(1);
	});

	it("should serve the errors and info from the cached result", async () => {
		const token = await createToken({ exp: Math.floor(Date.now() / 1000) + 1000 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: undefined
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });

		const errors: IError[] = [];
		const info: ITrustVerificationInfo = { identity: "" };
		expect(await verifier.verify(token, info, errors)).toBe(false);

		const cachedErrors: IError[] = [];
		const cachedInfo: ITrustVerificationInfo = { identity: "" };
		expect(await verifier.verify(token, cachedInfo, cachedErrors)).toBe(false);

		expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(1);
		expect(cachedErrors.map((f: IError) => f.message)).toEqual(
			errors.map((f: IError) => f.message)
		);
		expect(cachedInfo).toEqual(info);
		// The info holds a clone, so mutating it cannot corrupt the cached result.
		expect(cachedInfo.data?.verifiableCredential).not.toBe(info.data?.verifiableCredential);
	});

	it("should not decode the token again on a cache hit", async () => {
		const token = await createToken({ exp: Math.floor(Date.now() / 1000) + 1000 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });
		const decodeSpy = vi.spyOn(Jwt, "decode");
		try {
			await verifier.verify(token, { identity: "" }, []);
			await verifier.verify(token, { identity: "" }, []);
			await verifier.verify(token, { identity: "" }, []);

			expect(decodeSpy).toHaveBeenCalledTimes(1);
		} finally {
			decodeSpy.mockRestore();
		}
	});

	it("should stop serving an entry at the token expiry even while it is being hit", async () => {
		const nowMs = Date.now();
		const token = await createToken({ exp: Math.floor(nowMs / 1000) + 5 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({
			identityComponentType: "identity",
			config: { verificationCacheTtiMs: 3600000 }
		});
		vi.useFakeTimers();
		vi.setSystemTime(nowMs);
		try {
			// Hit the entry every second, so an idle window alone would keep it alive indefinitely.
			for (let offsetMs = 0; offsetMs <= 4000; offsetMs += 1000) {
				vi.setSystemTime(nowMs + offsetMs);
				await verifier.verify(token, { identity: "" }, []);
			}
			expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(1);

			// Past the token expiry the entry is gone, despite the hour long tti and the traffic.
			vi.setSystemTime(nowMs + 6000);
			const errors: IError[] = [];
			expect(await verifier.verify(token, { identity: "" }, errors)).toBe(false);
			expect(errors.some((f: IError) => f.message?.includes("tokenExpired"))).toBe(true);
			expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(2);
		} finally {
			vi.useRealTimers();
		}
	});

	it("should not cache the verification result when the tti is 0", async () => {
		const token = await createToken({ exp: Math.floor(Date.now() / 1000) + 1000 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({
			identityComponentType: "identity",
			config: { verificationCacheTtiMs: 0 }
		});

		await verifier.verify(token, { identity: "" }, []);
		await verifier.verify(token, { identity: "" }, []);

		expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(2);
	});

	it("should not serve a cached result once the token expiry has passed", async () => {
		const nowMs = Date.now();
		const token = await createToken({ exp: Math.floor(nowMs / 1000) + 1 });
		vi.useFakeTimers();
		vi.setSystemTime(nowMs);
		try {
			mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
				verifiableCredential: {
					issuer: "issuer",
					credentialSubject: { id: "subject" }
				}
			}));
			const verifier = new JwtVerifiableCredentialVerifier({
				identityComponentType: "identity",
				config: { verificationCacheTtiMs: 60000 }
			});

			await verifier.verify(token, { identity: "" }, []);
			expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(1);

			vi.setSystemTime(nowMs + 2000);
			const errors: IError[] = [];
			const result = await verifier.verify(token, { identity: "" }, errors);

			expect(result).toBe(false);
			expect(errors.some((f: IError) => f.message?.includes("tokenExpired"))).toBe(true);
			expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(2);
		} finally {
			vi.useRealTimers();
		}
	});

	it("should cache a token with no expiry until the tti elapses", async () => {
		const token = await createToken({});
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({
			identityComponentType: "identity",
			config: { verificationCacheTtiMs: 20 }
		});

		await verifier.verify(token, { identity: "" }, []);
		await verifier.verify(token, { identity: "" }, []);
		expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(1);

		await new Promise(resolve => setTimeout(resolve, 60));

		await verifier.verify(token, { identity: "" }, []);
		expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(2);
	});

	it("should not cache a verification which did not complete", async () => {
		const token = await createToken({ exp: Math.floor(Date.now() / 1000) + 1000 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementationOnce(async () => {
			throw new GeneralError("iotaIdentityConnector", "didResolutionTimeout", {
				did: "did:iota:testnet:0x4c6b",
				timeoutMs: 5000
			});
		});
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => ({
			verifiableCredential: {
				issuer: "issuer",
				credentialSubject: { id: "subject" }
			}
		}));
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });

		const errors: IError[] = [];
		expect(await verifier.verify(token, { identity: "" }, errors)).toBe(false);
		expect(errors.some((f: IError) => f.message?.includes("tokenVerificationIncomplete"))).toBe(
			true
		);

		// The fault was momentary, so the retry must reach the identity component rather than be
		// served the failure from the cache.
		const retryErrors: IError[] = [];
		expect(await verifier.verify(token, { identity: "" }, retryErrors)).toBe(true);
		expect(retryErrors).toEqual([]);
		expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(2);
	});

	it("should retry every call while the identity component keeps failing", async () => {
		const token = await createToken({ exp: Math.floor(Date.now() / 1000) + 1000 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => {
			throw new GeneralError("iotaIdentityConnector", "checkingVerifiableCredentialFailed");
		});
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });

		expect(await verifier.verify(token, { identity: "" }, [])).toBe(false);
		expect(await verifier.verify(token, { identity: "" }, [])).toBe(false);
		expect(mockIdentityComponent.verifiableCredentialVerify).toHaveBeenCalledTimes(2);
	});

	it("should report the expiry alongside a verification which did not complete", async () => {
		const token = await createToken({ exp: Math.floor(Date.now() / 1000) - 1000 });
		mockIdentityComponent.verifiableCredentialVerify.mockImplementation(async () => {
			throw new GeneralError("iotaIdentityConnector", "didResolutionTimeout");
		});
		const verifier = new JwtVerifiableCredentialVerifier({ identityComponentType: "identity" });

		const errors: IError[] = [];
		expect(await verifier.verify(token, { identity: "" }, errors)).toBe(false);
		expect(errors.some((f: IError) => f.message?.includes("tokenExpired"))).toBe(true);
		expect(errors.some((f: IError) => f.message?.includes("tokenVerificationIncomplete"))).toBe(
			true
		);
	});
});
