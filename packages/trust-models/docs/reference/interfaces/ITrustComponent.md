# Interface: ITrustComponent

Interface describing a trust component.

## Extends

- `IComponent`

## Methods

### verify()

> **verify**(`payload`, `overrideVerifiers?`): `Promise`\<\{ `verified`: `boolean`; `info?`: \{\[`key`: `string`\]: `unknown`; \}; `errors?`: `IError`[]; \}\>

Verify a payload by checking the validity of its structure and content using the registered verifiers.

#### Parameters

##### payload

`unknown`

The payload to verify.

##### overrideVerifiers?

`string`[]

List of verifiers to use instead of the default ones.

#### Returns

`Promise`\<\{ `verified`: `boolean`; `info?`: \{\[`key`: `string`\]: `unknown`; \}; `errors?`: `IError`[]; \}\>

Whether the payload is verified and any additional information extracted from the payload, or errors.

***

### generate()

> **generate**(`identity`, `generatorType?`, `info?`): `Promise`\<`unknown`\>

Generate a payload using the specified generators.

#### Parameters

##### identity

`string`

The identity for which to generate the payload.

##### generatorType?

`string`

The type of generator to use, defaults to the default generator type or first in factory.

##### info?

Optional information to include in the generated payload.

#### Returns

`Promise`\<`unknown`\>

The generated payload.
