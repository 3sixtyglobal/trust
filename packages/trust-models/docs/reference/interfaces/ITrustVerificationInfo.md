# Interface: ITrustVerificationInfo

Interface describing a trust verifier information.

## Properties

### identity {#identity}

> **identity**: `string`

The identity associated with the payload.

***

### tenantId? {#tenantid}

> `optional` **tenantId?**: `string`

The tenant that issued the payload, if multi-tenancy was active at generation time.

***

### organizationId? {#organizationid}

> `optional` **organizationId?**: `string`

The organisation that issued the payload, if an authenticated user context was available at generation time.

***

### data? {#data}

> `optional` **data?**: `object`

Additional JSON-LD node objects associated with the verification.

#### Index Signature

\[`key`: `string`\]: `IJsonLdNodeObject`
