# Class: JwtVerifiableCredentialGenerator

Class to generate a JWT Verifiable Credential.

## Implements

- `ITrustGenerator`

## Constructors

### Constructor

> **new JwtVerifiableCredentialGenerator**(`options`): `JwtVerifiableCredentialGenerator`

Create a new instance of JwtVerifiableCredentialGenerator.

#### Parameters

##### options

[`IJwtVerifiableCredentialGeneratorConstructorOptions`](../interfaces/IJwtVerifiableCredentialGeneratorConstructorOptions.md)

The options for the service.

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

The class name of the component.

#### Implementation of

`ITrustGenerator.className`

***

### generate() {#generate}

> **generate**(`organizationId`, `info?`, `options?`): `Promise`\<`unknown`\>

Generate a trust payload.

#### Parameters

##### organizationId

`string`

The identity for which to generate the payload.

##### info?

Information to use in the generation.

###### subject?

`IJsonLdNodeObject`

The subject of the verifiable credential (JSON-LD).
the JWT payload as the `org` claim.

##### options?

Per-call generation options.

###### tokenTtlInSeconds

`number`

TTL override in seconds for this token only. Takes precedence over the
config-level `tokenTtlInSeconds` when provided.

#### Returns

`Promise`\<`unknown`\>

The generated JWT.

#### Implementation of

`ITrustGenerator.generate`
