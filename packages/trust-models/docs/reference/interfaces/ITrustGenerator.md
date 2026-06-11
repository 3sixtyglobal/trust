# Interface: ITrustGenerator

Interface describing a trust generator component.

## Extends

- `IComponent`

## Methods

### generate() {#generate}

> **generate**(`identity`, `info?`, `options?`): `Promise`\<`unknown`\>

Generate a trust payload.

#### Parameters

##### identity

`string`

The identity for which to generate the payload.

##### info?

Information to use in the generation.

##### options?

Per-call generation options.

###### tokenTtlInSeconds

`number`

TTL override in seconds for this token only.

#### Returns

`Promise`\<`unknown`\>

The generated payload.
