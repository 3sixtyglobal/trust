# Class: JwtVerifiableCredentialVerifier

Class to verify a JWT Verifiable Credential.

## Implements

- `ITrustVerifier`

## Constructors

### Constructor

> **new JwtVerifiableCredentialVerifier**(`options?`): `JwtVerifiableCredentialVerifier`

Create a new instance of JwtVerifiableCredentialVerifier.

#### Parameters

##### options?

[`IJwtVerifiableCredentialVerifierConstructorOptions`](../interfaces/IJwtVerifiableCredentialVerifierConstructorOptions.md)

The options for the service.

#### Returns

`JwtVerifiableCredentialVerifier`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className()

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`ITrustVerifier.className`

***

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

#### Implementation of

`ITrustVerifier.verify`
