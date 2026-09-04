# Interface: IJwtVerifiableCredentialVerifierConfig

Configuration for the JWT Verifiable Credential Verifier.

## Properties

### verificationCacheTtiMs? {#verificationcachettims}

> `optional` **verificationCacheTtiMs?**: `number`

Time-to-idle in milliseconds for cached verification outcomes. An entry is also given the
token expiry as a hard deadline, so it is dropped at whichever comes first.
Set to 0 to disable caching and decode and verify on every call.

#### Default

```ts
5000
```

***

### verificationCacheCapacity? {#verificationcachecapacity}

> `optional` **verificationCacheCapacity?**: `number`

Maximum number of verification outcomes retained in the cache.

#### Default

```ts
1000
```

***

### verificationCacheMutexTimeoutMs? {#verificationcachemutextimeoutms}

> `optional` **verificationCacheMutexTimeoutMs?**: `number`

Maximum time in milliseconds to wait for the verification cache mutex when concurrent
calls request the same credential.
