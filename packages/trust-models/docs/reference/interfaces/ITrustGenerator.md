# Interface: ITrustGenerator

Interface describing a trust generator component.

## Extends

- `IComponent`

## Methods

### generate() {#generate}

> **generate**(`identity`, `info?`, `tenantIdHash?`, `organizationId?`): `Promise`\<`unknown`\>

Generate a trust payload.

#### Parameters

##### identity

`string`

The identity for which to generate the payload.

##### info?

Information to use in the generation.

##### tenantIdHash?

`string`

Optional tenant identifier to embed in the payload, should be an opaque hashed version.

##### organizationId?

`string`

Optional organization identifier to embed in the payload.

#### Returns

`Promise`\<`unknown`\>

The generated payload.
