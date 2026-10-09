# Trust Generators Examples

These snippets show how to create JWT credential payloads and inspect generator metadata in a typical DID-based flow.

## JwtVerifiableCredentialGenerator

```typescript
import { ComponentFactory } from '@3sixty/core';
import type { IIdentityComponent } from '@3sixty/identity-models';
import { JwtVerifiableCredentialGenerator } from '@3sixty/trust-generators';

const identityComponent: IIdentityComponent = {
  verifiableCredentialCreate: async () => ({
    jwt: 'eyJhbGciOiJFZERTQSJ9.eyJpc3MiOiJkaWQ6ZXhhbXBsZTppc3N1ZXIifQ.signature'
  })
} as IIdentityComponent;

ComponentFactory.register('identity', () => identityComponent);

const generator = new JwtVerifiableCredentialGenerator({
  identityComponentType: 'identity',
  config: {
    verificationMethodId: 'did:example:issuer#key-1',
    tokenTtlInSeconds: 900
  }
});

console.log(generator.className()); // JwtVerifiableCredentialGenerator

const jwt = await generator.generate('did:example:issuer', {
  subject: {
    id: 'did:example:subject',
    role: 'supplier'
  }
});

console.log(typeof jwt); // string
```
