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

> **generate**(`identity`, `info?`, `tenantId?`, `organizationId?`): `Promise`\<`unknown`\>

Generate a trust payload.

#### Parameters

##### identity

`string`

The identity for which to generate the payload.

##### info?

Information to use in the generation.

###### subject?

`IJsonLdNodeObject`

The subject of the verifiable credential (JSON-LD).

##### tenantId?

`string`

Optional tenant identifier. Embedded directly in the JWT
payload as the `tid` claim (mirroring the existing auth-service session-JWT shape).

##### organizationId?

`string`

Optional organization identifier. Embedded directly in
the JWT payload as the `org` claim.

#### Returns

`Promise`\<`unknown`\>

The generated JWT.

#### Implementation of

`ITrustGenerator.generate`
