# Interface: ITrustComponent

Interface describing a trust component.

## Extends

- `IComponent`

## Methods

### verify()

> **verify**(`payload`, `overrideVerifiers?`): `Promise`\<\{ `verified`: `boolean`; `info?`: `IJsonLdNodeObject`[]; `failures?`: \{\[`id`: `string`\]: `IError`[]; \}; \}\>

Verify a payload by checking the validity of its structure and content using the registered verifiers.

#### Parameters

##### payload

`unknown`

The payload to verify.

##### overrideVerifiers?

`string`[]

List of verifiers to use instead of the default ones.

#### Returns

`Promise`\<\{ `verified`: `boolean`; `info?`: `IJsonLdNodeObject`[]; `failures?`: \{\[`id`: `string`\]: `IError`[]; \}; \}\>

Whether the payload is verified and any additional information extracted from the payload, or failures per verifier.
