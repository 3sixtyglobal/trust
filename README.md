# 3Sixty Trust

This repository provides a cohesive set of trust building blocks for issuing, validating, and orchestrating verifiable trust artefacts across distributed applications. The packages are designed to work together so that shared models, generation workflows, verification logic, and service orchestration remain consistent.

By separating concerns across focused packages, the codebase supports reuse, clearer integration boundaries, and simpler adoption in systems that need reliable trust and credential processing.

## Packages

- [trust-models](packages/trust-models/README.md) - Defines shared trust data models and interfaces for credentials, proofs, and trust components.
- [trust-service](packages/trust-service/README.md) - Provides an orchestrating trust service that composes generators and verifiers into a unified API.
- [trust-generators](packages/trust-generators/README.md) - Implements trust credential generators that produce signed verifiable credential artefacts.
- [trust-verifiers](packages/trust-verifiers/README.md) - Implements trust verifiers that validate credentials and proofs against trust model requirements.

## Contributing

To contribute to this package see the guidelines for building and publishing in [CONTRIBUTING](./CONTRIBUTING.md)

## Origin

This repository is derived from the original [iotaledger/twin-trust](https://github.com/iotaledger/twin-trust) repository.
