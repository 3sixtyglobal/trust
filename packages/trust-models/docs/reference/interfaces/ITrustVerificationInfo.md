# Interface: ITrustVerificationInfo

Interface describing a trust verifier information.

## Properties

### identity

> **identity**: `string`

The identity associated with the payload.

***

### data?

> `optional` **data**: `object`

Additional JSON-LD node objects associated with the verification.

#### Index Signature

\[`key`: `string`\]: `IJsonLdNodeObject`
