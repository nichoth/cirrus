# Personal PDS on Cloudflare Workers

This is an example deployment of `@getcirrus/pds` - a single-user AT Protocol Personal Data Server on Cloudflare Workers.

> **⚠️ Experimental Software**
>
> This is an early-stage project under active development. **Do not migrate your main Bluesky account to this PDS yet.** Use a test account or create a new identity for experimentation.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Use the PDS CLI to generate keys and configure your local dev environment:

```bash
npm run pds init
```

This will prompt for your hostname, handle, and password, then write configuration to `.dev.vars`.

### 3. Run locally

```bash
npm run dev
```

This starts a local development server using Miniflare with your `.dev.vars` configuration.

### 4. Deploy to production

Use the PDS CLI to configure for production:

```bash
npm run pds init
```

This sets vars in `wrangler.jsonc` and secrets via `wrangler secret put`.

Or configure secrets individually:

```bash
npm run pds secret key      # Generate signing keypair
npm run pds secret jwt      # Generate JWT secret
npm run pds secret password # Set login password
```

Then deploy:

```bash
npm run deploy
```

## Configuration

Configuration is via environment variables: vars in the `wrangler.jsonc` and secrets. Use `npm run pds init` to configure interactively.

**Vars (in wrangler.jsonc):**

- `PDS_HOSTNAME` - Public hostname of the PDS
- `DID` - Account DID (e.g., did:web:pds.example.com)
- `HANDLE` - Account handle (e.g., alice.example.com)
- `SIGNING_KEY_PUBLIC` - Public key for DID document (multibase)

**Secrets (via wrangler):**

- `AUTH_TOKEN` - Bearer token for API write operations
- `SIGNING_KEY` - Private signing key (secp256k1 JWK)
- `JWT_SECRET` - Secret for signing session JWTs
- `PASSWORD_HASH` - Bcrypt hash of account password (for Bluesky app login)

## Architecture

This deployment simply re-exports the `@getcirrus/pds` package:

```typescript
// src/index.ts
export { default, AccountDurableObject } from "@getcirrus/pds";
```

No additional code needed!

## Endpoints

Once deployed, your PDS will serve:

- `GET /.well-known/did.json` - DID document
- `GET /xrpc/_health` - Health check
- `GET /xrpc/com.atproto.sync.getRepo` - Export repository as CAR
- `GET /xrpc/com.atproto.sync.subscribeRepos` - WebSocket firehose
- `POST /xrpc/com.atproto.repo.createRecord` - Create a record (authenticated)
- `POST /xrpc/com.atproto.repo.uploadBlob` - Upload a blob (authenticated)
- And more...

## Resources

- [AT Protocol Docs](https://atproto.com)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
