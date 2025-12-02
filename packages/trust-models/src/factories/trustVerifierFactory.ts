// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@twin.org/core";
import type { ITrustVerifier } from "../models/ITrustVerifier.js";

/**
 * Factory for managing verifier registration and retrieval.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const TrustVerifierFactory = Factory.createFactory<ITrustVerifier>("trust-verifier");
