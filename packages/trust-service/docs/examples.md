# Trust Service Examples

The following snippets show a practical end-to-end flow where generators and verifiers are registered once and reused for trust operations.

## TrustService

```typescript
import { TrustService } from '@3sixty/trust-service';
import {
  TrustGeneratorFactory,
  TrustVerifierFactory,
  type ITrustGenerator,
  type ITrustVerifier
} from '@3sixty/trust-models';
import type { IError } from '@3sixty/core';

const generator: ITrustGenerator = {
  className: () => 'JwtGenerator',
  generate: async (identity, info) => ({
    token: 'eyJhbGciOiJFZERTQSJ9.eyJpc3MiOiJkaWQ6ZXhhbXBsZTppc3N1ZXIifQ.signature',
    identity,
    subject: info?.subject
  })
};

const verifier: ITrustVerifier = {
  className: () => 'JwtVerifier',
  verify: async (payload, info, _errors) => {
    const hasToken = typeof payload === 'object' && payload !== null && 'token' in payload;
    if (!hasToken) {
      return false;
    }

    info.identity = 'did:example:issuer';
    info.data = {
      subject: {
        id: 'did:example:subject',
        status: 'active'
      }
    };
    return true;
  }
};

TrustGeneratorFactory.register('jwt', () => generator);
TrustVerifierFactory.register('jwt', () => verifier);

const trustService = new TrustService({
  config: {
    defaultGeneratorType: 'jwt'
  }
});

console.log(trustService.className()); // TrustService

const payload = await trustService.generate('did:example:issuer', 'jwt', {
  subject: {
    id: 'did:example:subject',
    level: 'gold'
  }
});

console.log(payload); // { token: "eyJhbGciOiJFZERTQSJ9.eyJpc3MiOiJkaWQ6ZXhhbXBsZTppc3N1ZXIifQ.signature", identity: "did:example:issuer", subject: { id: "did:example:subject", level: "gold" } }

const verification = await trustService.verify(payload, ['jwt']);

console.log(verification.verified); // true
console.log(verification.info?.identity); // did:example:issuer
```
