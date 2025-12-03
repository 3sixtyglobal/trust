# Interface: ITrustVerifier

Interface describing a trust verifier component.

## Extends

- `IComponent`

## Methods

### verify()

> **verify**(`payload`, `info`): `Promise`\<\{ `verified`: `boolean`; `failures?`: `IError`[]; \} \| `undefined`\>

Verify a payload by checking the validity of its structure and content.

#### Parameters

##### payload

`unknown`

The payload to verify.

##### info

`IJsonLdNodeObject`[]

Information extracted from previous verifiers and to be added by this verifier.

#### Returns

`Promise`\<\{ `verified`: `boolean`; `failures?`: `IError`[]; \} \| `undefined`\>

Whether the payload is verified and possible verification failures, returns undefined if payload not processed.
