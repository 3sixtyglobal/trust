# Class: TrustHelper

Helper class for trust-related operations.

## Constructors

### Constructor

> **new TrustHelper**(): `TrustHelper`

#### Returns

`TrustHelper`

## Properties

### CLASS\_NAME

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### verifyTrust()

> `static` **verifyTrust**(`component`, `trustPayload`, `action`, `overrideVerifiers?`, `includeErrorDetails?`): `Promise`\<[`ITrustVerificationInfo`](../interfaces/ITrustVerificationInfo.md)\>

Verify the trust payload for the action.

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

The information from the trust verification.
