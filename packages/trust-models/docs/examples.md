# Trust Models Examples

Use these patterns to register trust components, resolve them from factories, and enforce trust checks before handling protected actions.

## TrustGeneratorFactory

```typescript
import { TrustGeneratorFactory, type ITrustGenerator } from '@3sixty/trust-models';

const signedPayloadGenerator: ITrustGenerator = {
  className: () => 'SignedPayloadGenerator',
  generate: async (identity, info) => ({
    identity,
    issuedAt: new Date('2026-03-09T10:00:00Z').toISOString(),
    subject: info?.subject
  })
};

TrustGeneratorFactory.register('signedPayload', () => signedPayloadGenerator);

const availableGeneratorTypes = TrustGeneratorFactory.names();
console.log(availableGeneratorTypes); // ["signedPayload"]

const generator = TrustGeneratorFactory.get('signedPayload');
const generated = await generator.generate('did:example:issuer', {
  subject: {
    id: 'did:example:subject',
    category: 'manufacturer'
  }
});

console.log(generated); // { identity: "did:example:issuer", issuedAt: "2026-03-09T10:00:00.000Z", subject: { id: "did:example:subject", category: "manufacturer" } }

TrustGeneratorFactory.unregister('signedPayload');
```

## TrustVerifierFactory

```typescript
import {
  TrustVerifierFactory,
  type ITrustVerificationInfo,
  type ITrustVerifier
} from '@3sixty/trust-models';
import type { IError } from '@3sixty/core';

const audienceVerifier: ITrustVerifier = {
  className: () => 'AudienceVerifier',
  verify: async (payload, info, _errors) => {
    const audience =
      typeof payload === 'object' && payload !== null ? Reflect.get(payload, 'aud') : '';
    const trustedAudience = typeof audience === 'string' && audience === 'did:example:api';

    if (!trustedAudience) {
      return false;
    }

    info.identity = 'did:example:issuer';
    info.data = {
      audience: {
        id: 'did:example:api'
      }
    };
    return true;
  }
};

TrustVerifierFactory.register('audience', () => audienceVerifier);

const verifier = TrustVerifierFactory.get('audience');
const info: ITrustVerificationInfo = { identity: '' };
const errors: IError[] = [];
const verified = await verifier.verify({ aud: 'did:example:api' }, info, errors);

console.log(verified); // true
console.log(info.identity); // did:example:issuer

TrustVerifierFactory.unregister('audience');
```

## TrustHelper

```typescript
import { TrustHelper, type ITrustComponent } from '@3sixty/trust-models';

const trustComponent: ITrustComponent = {
  className: () => 'MockTrustComponent',
  verify: async () => ({
    verified: true,
    info: {
      identity: 'did:example:issuer',
      data: {
        subject: {
          id: 'did:example:subject',
          status: 'active'
        }
      }
    }
  }),
  generate: async () => 'not-used-in-this-example'
};

const trustInfo = await TrustHelper.verifyTrust(
  trustComponent,
  'eyJhbGciOiJFZERTQSJ9.eyJpc3MiOiJkaWQ6ZXhhbXBsZTppc3N1ZXIifQ.signature',
  'createCredential',
  ['audience']
);

console.log(trustInfo.identity); // did:example:issuer
```
