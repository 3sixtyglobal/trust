# Interface: ITrustVerifier

Interface describing a trust verifier component.

## Extends

- `IComponent`

## Methods

### verify()

> **verify**(`payload`): `Promise`\<\{ `verified`: `boolean`; `info?`: `IJsonLdNodeObject`[]; `failures?`: `IError`[]; \}\>

Verify a payload by checking the validity of its structure and content.

#### Parameters

##### payload

`unknown`

The payload to verify.

#### Returns

`Promise`\<\{ `verified`: `boolean`; `info?`: `IJsonLdNodeObject`[]; `failures?`: `IError`[]; \}\>

Whether the payload is verified and any additional information extracted from the payload, or verification failures.
