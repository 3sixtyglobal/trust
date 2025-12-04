# Interface: ITrustGenerator

Interface describing a trust generator component.

## Extends

- `IComponent`

## Methods

### generate()

> **generate**(`identity`, `info?`): `Promise`\<`unknown`\>

Generate a trust payload.

#### Parameters

##### identity

`string`

The identity for which to generate the payload.

##### info?

Information to use in the generation.

#### Returns

`Promise`\<`unknown`\>

The generated payload.
