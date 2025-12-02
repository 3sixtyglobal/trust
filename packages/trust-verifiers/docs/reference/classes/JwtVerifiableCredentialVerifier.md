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

> **verify**(`payload`): `Promise`\<\{ `verified`: `boolean`; `info?`: `IJsonLdNodeObject`[]; `failures?`: `IError`[]; \}\>

Verify a payload by checking the validity of its structure and content.

#### Parameters

##### payload

`unknown`

The payload to verify.

#### Returns

`Promise`\<\{ `verified`: `boolean`; `info?`: `IJsonLdNodeObject`[]; `failures?`: `IError`[]; \}\>

Whether the payload is verified and any additional information extracted from the payload, or verification failures.

#### Implementation of

`ITrustVerifier.verify`
