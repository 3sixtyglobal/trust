# Class: TrustService

Class for performing trust operations.

## Implements

- `ITrustComponent`

## Constructors

### Constructor

> **new TrustService**(`options?`): `TrustService`

Create a new instance of TrustService.

#### Parameters

##### options?

[`ITrustServiceConstructorOptions`](../interfaces/ITrustServiceConstructorOptions.md)

The options for the service.

#### Returns

`TrustService`

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

`ITrustComponent.className`

***

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

#### Implementation of

`ITrustComponent.verify`
