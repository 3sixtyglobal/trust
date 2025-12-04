# Interface: ITrustVerifier

Interface describing a trust verifier component.

## Extends

- `IComponent`

## Methods

### verify()

> **verify**(`payload`, `info`, `errors`): `Promise`\<`boolean` \| `undefined`\>

Verify a payload by checking the validity of its structure and content.

#### Parameters

##### payload

`unknown`

The payload to verify.

##### info

`IJsonLdNodeObject`[]

Information extracted from previous verifiers and to be added by this verifier.

##### errors

`IError`[]

Array to collect verification errors.

#### Returns

`Promise`\<`boolean` \| `undefined`\>

Whether the payload is verified, returns undefined if payload was not processed.
