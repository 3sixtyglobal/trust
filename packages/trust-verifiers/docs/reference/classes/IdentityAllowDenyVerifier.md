# Class: IdentityAllowDenyVerifier

Class to gate verification based on allowed and denied identity lists.

## Implements

- `ITrustVerifier`

## Constructors

### Constructor

> **new IdentityAllowDenyVerifier**(`options?`): `IdentityAllowDenyVerifier`

Create a new instance of IdentityAllowDenyVerifier.

#### Parameters

##### options?

[`IIdentityAllowDenyVerifierConstructorOptions`](../interfaces/IIdentityAllowDenyVerifierConstructorOptions.md)

The options for the verifier.

#### Returns

`IdentityAllowDenyVerifier`

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

The class name of the component.

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
