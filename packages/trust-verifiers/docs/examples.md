# Trust Verifiers Examples

These snippets demonstrate how to initialise a JWT verifier and evaluate a token while collecting identity and subject details.

## JwtVerifiableCredentialVerifier

```typescript
import { ComponentFactory, type IError } from '@3sixty/core';
import type { IIdentityComponent } from '@3sixty/identity-models';
import type { ITrustVerificationInfo } from '@3sixty/trust-models';
import { JwtVerifiableCredentialVerifier } from '@3sixty/trust-verifiers';

const identityComponent: IIdentityComponent = {
  verifiableCredentialVerify: async () => ({
    verifiableCredential: {
      issuer: 'did:example:issuer',
      credentialSubject: {
        id: 'did:example:subject',
        role: 'supplier'
      }
    }
  })
} as IIdentityComponent;

ComponentFactory.register('identity', () => identityComponent);

const verifier = new JwtVerifiableCredentialVerifier({
  identityComponentType: 'identity'
});

console.log(verifier.className()); // JwtVerifiableCredentialVerifier

const info: ITrustVerificationInfo = { identity: '' };
const errors: IError[] = [];
const verified = await verifier.verify(
  'eyJhbGciOiJFZERTQSJ9.eyJleHAiOjQwMDAwMDAwMDB9.signature',
  info,
  errors
);

console.log(verified); // true
console.log(info.identity); // did:example:issuer
console.log(info.data?.subject); // { id: "did:example:subject", role: "supplier" }
```
