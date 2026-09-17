# Interface: IJwtVerificationCacheEntry

The outcome of verifying a JWT, held in the verifier cache.

## Properties

### verified {#verified}

> **verified**: `boolean`

Whether the payload is verified.

***

### completed {#completed}

> **completed**: `boolean`

Whether the verification ran to completion. False when the identity component threw, as the
outcome is then not a verdict on the token, and only a completed verification is cached.

***

### errors {#errors}

> **errors**: `IError`[]

The errors collected during the verification.

***

### identity? {#identity}

> `optional` **identity?**: `string`

The identity to associate with the payload, undefined when the credential had no issuer.

***

### data? {#data}

> `optional` **data?**: `object`

The data to associate with the payload.

#### Index Signature

\[`key`: `string`\]: `IJsonLdNodeObject`
