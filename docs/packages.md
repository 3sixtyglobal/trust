# Trust Packages

## trust-models

This package defines shared trust data models and interfaces for credentials, proofs, and trust components. It establishes a consistent contract layer that other packages can depend on, helping teams integrate trust capabilities with predictable structures and semantics. Its model design aligns with wider verifiable credential practices such as the [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model-2.0/), making interoperability easier to maintain.

- [README](../packages/trust-models/README.md)
- [Examples](../packages/trust-models/docs/examples.md)
- [Changelog](../packages/trust-models/docs/changelog.md)

## trust-service

This package provides an orchestrating trust service that composes generators and verifiers into a unified API. It offers a central application-facing layer for trust workflows so that calling code can rely on one coherent service boundary rather than coordinating lower-level components directly. This improves maintainability and supports consistent behaviour across deployments.

- [README](../packages/trust-service/README.md)
- [Examples](../packages/trust-service/docs/examples.md)
- [Changelog](../packages/trust-service/docs/changelog.md)

## trust-generators

This package implements trust credential generators that produce signed verifiable credential artefacts. It is focused on building valid outputs from trusted inputs, including issuer and subject context, so that generated credentials can be exchanged and validated reliably in downstream systems. The package is designed around established credential ecosystem expectations, including compatibility with the [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model-2.0/).

- [README](../packages/trust-generators/README.md)
- [Examples](../packages/trust-generators/docs/examples.md)
- [Changelog](../packages/trust-generators/docs/changelog.md)

## trust-verifiers

This package implements trust verifiers that validate credentials and proofs against trust model requirements. It helps systems assess authenticity and structural correctness before accepting trust artefacts, reducing the risk of invalid or tampered data entering business flows. By codifying verification behaviour in reusable components, it supports dependable trust enforcement across environments.

- [README](../packages/trust-verifiers/README.md)
- [Examples](../packages/trust-verifiers/docs/examples.md)
- [Changelog](../packages/trust-verifiers/docs/changelog.md)
