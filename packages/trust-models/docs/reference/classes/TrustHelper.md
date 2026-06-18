# Class: TrustHelper

Helper class for trust-related operations.

## Constructors

### Constructor

> **new TrustHelper**(): `TrustHelper`

#### Returns

`TrustHelper`

## Properties

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### verifyTrust() {#verifytrust}

> `static` **verifyTrust**(`component`, `trustPayload`, `action`, `overrideVerifiers?`, `includeErrorDetails?`): `Promise`\<[`ITrustVerificationInfo`](../interfaces/ITrustVerificationInfo.md)\>

Verifies the trust payload for the action, throwing if verification fails.

#### Parameters

##### component

[`ITrustComponent`](../interfaces/ITrustComponent.md)

The trust component to use.

##### trustPayload

`unknown`

The trust payload to verify.

##### action

`string`

The action being performed.

##### overrideVerifiers?

`string`[]

List of verifiers to use instead of the default ones.

##### includeErrorDetails?

`boolean` = `false`

Whether to include detailed error information in the exception if verification fails.

#### Returns

`Promise`\<[`ITrustVerificationInfo`](../interfaces/ITrustVerificationInfo.md)\>

A promise that resolves to the verified trust information.

#### Throws

UnauthorizedError if the payload cannot be verified or the identity is missing.
