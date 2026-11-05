// Copyright 2025 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@3sixty/core";
import type { ITrustGenerator } from "../models/ITrustGenerator.js";

/**
 * Factory for managing generator registration and retrieval.
 */
export const TrustGeneratorFactory = Factory.createFactory<ITrustGenerator>("trust-generator");
