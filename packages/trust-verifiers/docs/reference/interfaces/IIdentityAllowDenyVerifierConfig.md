# Interface: IIdentityAllowDenyVerifierConfig

Configuration for the Identity Allow/Deny Verifier.

## Properties

### allowIdentities? {#allowidentities}

> `optional` **allowIdentities?**: `string`[]

Identities that are permitted; all others are rejected.
Skipped when empty or absent.

***

### denyIdentities? {#denyidentities}

> `optional` **denyIdentities?**: `string`[]

Identities that are explicitly rejected.
Skipped when empty or absent.
