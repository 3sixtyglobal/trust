# Class: TrustService

Class for performing trust operations.

## Implements

- `ITrustComponent`

## Constructors

### Constructor

> **new TrustService**(`options?`): `TrustService`

Creates a new instance of TrustService.

#### Parameters

##### options?

[`ITrustServiceConstructorOptions`](../interfaces/ITrustServiceConstructorOptions.md)

The options for the service.

#### Returns

`TrustService`

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

`ITrustComponent.className`

***

### verify() {#verify}

> **verify**(`payload`, `overrideVerifiers?`): `Promise`\<\{ `verified`: `boolean`; `info?`: `ITrustVerificationInfo`; `errors?`: `IError`[]; \}\>

Verifies a payload using all registered verifiers or an explicit override list.

#### Parameters

##### payload

`unknown`

The payload to verify.

##### overrideVerifiers?

`string`[]

List of verifiers to use instead of the registered defaults.

#### Returns

`Promise`\<\{ `verified`: `boolean`; `info?`: `ITrustVerificationInfo`; `errors?`: `IError`[]; \}\>

A promise that resolves to the verification result, including the verified flag, extracted info, and any errors.

#### Implementation of

`ITrustComponent.verify`

***

### generate() {#generate}

> **generate**(`identity`, `generatorType?`, `info?`, `options?`): `Promise`\<`unknown`\>

Generates a trust payload using the specified or default generator.

#### Parameters

##### identity

`string`

The identity for which to generate the payload.

##### generatorType?

`string`

The generator type to use; falls back to the configured default or the first registered generator.

##### info?

Optional information to include in the generated payload.

##### options?

Per-call generation options.

###### tokenTtlInSeconds

`number`

TTL override in seconds for this token only; takes precedence over the config-level value when provided.

#### Returns

`Promise`\<`unknown`\>

A promise that resolves to the generated payload.

#### Throws

GeneralError if no generators are registered.

#### Implementation of

`ITrustComponent.generate`
