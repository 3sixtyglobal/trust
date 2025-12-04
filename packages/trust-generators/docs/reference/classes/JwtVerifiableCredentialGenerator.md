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

`ITrustGenerator.className`

***

### generate()

> **generate**(`info`): `Promise`\<`unknown`\>

Generate a trust payload.

#### Parameters

##### info

Information to use in the generation.

###### identity

`string`

The identity issuing the verifiable credential.

###### subject?

`IJsonLdNodeObject`

The subject of the verifiable credential.

#### Returns

`Promise`\<`unknown`\>

The generated payload.

#### Implementation of

`ITrustGenerator.generate`
