# Class: JwtVerifiableCredentialVerifier

Class to verify a JWT Verifiable Credential.

## Implements

- `ITrustVerifier`

## Constructors

### Constructor

> **new JwtVerifiableCredentialVerifier**(`options?`): `JwtVerifiableCredentialVerifier`

Creates a new instance of JwtVerifiableCredentialVerifier.

#### Parameters

##### options?

[`IJwtVerifiableCredentialVerifierConstructorOptions`](../interfaces/IJwtVerifiableCredentialVerifierConstructorOptions.md)

The options for the verifier.

#### Returns

`JwtVerifiableCredentialVerifier`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The runtime class name string

#### Implementation of

`ITrustVerifier.className`

***

### verify() {#verify}

> **verify**(`payload`, `info`, `errors`): `Promise`\<`boolean` \| `undefined`\>

Verify a payload by checking the validity of its structure and content.

#### Parameters

##### payload

`unknown`

The payload to verify.

##### info

`ITrustVerificationInfo`

Information extracted from previous verifiers and to be added by this verifier.

##### errors

`IError`[]

Array to collect verification errors.

#### Returns

`Promise`\<`boolean` \| `undefined`\>

Whether the payload is verified, returns undefined if payload was not processed.

#### Implementation of

`ITrustVerifier.verify`
