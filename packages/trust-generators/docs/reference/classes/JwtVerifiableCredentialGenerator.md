# Class: JwtVerifiableCredentialGenerator

Class to generate a JWT Verifiable Credential.

## Implements

- `ITrustGenerator`

## Constructors

### Constructor

> **new JwtVerifiableCredentialGenerator**(`options`): `JwtVerifiableCredentialGenerator`

Creates a new instance of JwtVerifiableCredentialGenerator.

#### Parameters

##### options

[`IJwtVerifiableCredentialGeneratorConstructorOptions`](../interfaces/IJwtVerifiableCredentialGeneratorConstructorOptions.md)

The options for the generator.

#### Returns

`JwtVerifiableCredentialGenerator`

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

`ITrustGenerator.className`

***

### generate() {#generate}

> **generate**(`organizationId`, `info?`, `options?`): `Promise`\<`unknown`\>

Generates a JWT Verifiable Credential for the given organization identity.

#### Parameters

##### organizationId

`string`

The identity for which to generate the credential.

##### info?

Information to use in the generation.

###### subject?

`IJsonLdNodeObject`

The subject of the verifiable credential as a JSON-LD node object; defaults to `{ id: organizationId }` when omitted.

##### options?

Per-call generation options.

###### tokenTtlInSeconds

`number`

TTL override in seconds for this token only; takes precedence over the config-level value when provided.

#### Returns

`Promise`\<`unknown`\>

A promise that resolves to the signed JWT string.

#### Implementation of

`ITrustGenerator.generate`
