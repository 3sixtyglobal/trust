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

> **verify**(`payload`, `overrideVerifiers?`): `Promise`\<\{ `verified`: `boolean`; `info?`: `ITrustVerificationInfo`; `errors?`: `IError`[]; \}\>

Verify a payload by checking the validity of its structure and content using the registered verifiers.

#### Parameters

##### payload

`unknown`

The payload to verify.

##### overrideVerifiers?

`string`[]

List of verifiers to use instead of the default ones.

#### Returns

`Promise`\<\{ `verified`: `boolean`; `info?`: `ITrustVerificationInfo`; `errors?`: `IError`[]; \}\>

Whether the payload is verified and any additional information extracted from the payload, or verification errors.

#### Implementation of

`ITrustComponent.verify`

***

### generate()

> **generate**(`identity`, `generatorType?`, `info?`): `Promise`\<`unknown`\>

Generate a payload using the specified generators.

#### Parameters

##### identity

`string`

The identity for which to generate the payload.

##### generatorType?

`string`

The type of generator to use, defaults to the default generator type or first in factory.

##### info?

Optional information to include in the generated payload.

#### Returns

`Promise`\<`unknown`\>

The generated payload.

#### Implementation of

`ITrustComponent.generate`
