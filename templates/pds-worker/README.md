# Your Personal PDS

A single-user AT Protocol Personal Data Server running on Cloudflare Workers.

> **⚠️ Experimental Beta Software**
>
> This is experimental software under active development. While account migration has been tested and works, this PDS implementation is still being refined. Breaking changes may occur, and not all edge cases have been discovered. **Strongly consider backing up important data before migrating a primary account.**

## Before You Get Started

Before setting up your PDS, make sure you have:

1. **A Cloudflare account** – Sign up at [cloudflare.com](https://cloudflare.com) if you don't have one
2. **Your domain added to Cloudflare** – Add the domain you plan to use for your PDS to your Cloudflare account:
   - Log into the Cloudflare dashboard
   - Click "Add a site" and enter your domain
   - Follow the instructions to update your domain's nameservers to point to Cloudflare
   - Wait for DNS propagation (usually a few minutes, can take up to 24 hours)

Once your domain is active in Cloudflare, you're ready to proceed with the setup below.

## Getting Started

### 1. Install dependencies

```bash
npm install
# or: npm install / yarn install
```

### 2. Configure the PDS

Run the setup wizard if not already done:

```bash
npm run pds init
```

This prompts for:

- **PDS hostname** – The deployment domain (e.g., `pds.example.com`)
- **Handle** – The Bluesky username (e.g., `alice.example.com`)
- **Password** – For logging in from Bluesky apps

The wizard generates cryptographic keys and writes configuration to `.dev.vars` and `wrangler.jsonc`.

### 3. Run locally

```bash
npm run dev
```

The PDS is now running at http://localhost:5173. Test it with:

```bash
curl http://localhost:5173/xrpc/_health
curl http://localhost:5173/.well-known/did.json
```

### 4. Deploy to production

When running `pds init`, answer "Yes" when asked if you want to deploy to Cloudflare. This pushes secrets to Cloudflare Workers.

Then deploy the worker:

```bash
npm run deploy
```

Finally, configure DNS to point your domain to the worker.

## Migrating an Existing Account

To move an existing Bluesky account from bsky.social or another PDS:

### Step 1: Configure for migration

```bash
npm run pds init
# Answer "Yes" when asked about migrating an existing account
```

This detects your existing account, generates new signing keys, and configures the PDS in deactivated mode.

### Step 2: Deploy and transfer data

```bash
npm run deploy                  # Deploy the worker
npm run pds migrate                 # Transfer data from source PDS
```

The migrate command downloads the repository (posts, follows, likes) and all images/videos from the current PDS. If interrupted, run it again to resume.

### Step 3: Update your identity

```bash
npm run pds identity
```

This updates your DID document to point to your new PDS. You'll need to:

1. Enter your password for the source PDS
2. Enter the confirmation token sent to your email

### Step 4: Activate the account

```bash
npm run pds activate
```

This enables writes on your new PDS. Your account is now live.

### Step 5: Verify the migration

```bash
npm run pds status
```

Check that the account is active and your handle resolves correctly.

### Full command sequence

```bash
npm run pds init                    # Configure + deploy secrets (answer "Yes" to deploy)
npm run deploy                  # Deploy the worker
npm run pds migrate                 # Transfer data from source PDS
npm run pds identity                # Update DID document (requires email)
npm run pds activate                # Enable writes
npm run pds status                  # Verify everything is working
```

## CLI Commands

| Command                          | Description                                              |
| -------------------------------- | -------------------------------------------------------- |
| `npm run pds init`               | Interactive setup wizard (prompts for Cloudflare deploy) |
| `npm run pds migrate`            | Transfer account from source PDS                         |
| `npm run pds migrate -- --clean` | Reset and re-import data                                 |
| `npm run pds identity`           | Update DID document to point to new PDS                  |
| `npm run pds activate`           | Enable writes (go live)                                  |
| `npm run pds deactivate`         | Disable writes (for re-import)                           |
| `npm run pds status`             | Check account and repository status                      |
| `npm run pds passkey add`        | Register a passkey for passwordless login                |
| `npm run pds secret key`         | Generate new signing keypair                             |
| `npm run pds secret jwt`         | Generate new JWT secret                                  |
| `npm run pds secret password`    | Set account password                                     |

Add `--dev` to target your local development server instead of production.

## Configuration

### Public Variables (wrangler.jsonc)

| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| `PDS_HOSTNAME`       | Public hostname (e.g., pds.example.com) |
| `DID`                | Account DID                             |
| `HANDLE`             | Account handle                          |
| `SIGNING_KEY_PUBLIC` | Public key for DID document             |

### Secrets (.dev.vars or Cloudflare)

| Variable        | Description                           |
| --------------- | ------------------------------------- |
| `AUTH_TOKEN`    | Bearer token for API write operations |
| `SIGNING_KEY`   | Private signing key                   |
| `JWT_SECRET`    | Secret for session tokens             |
| `PASSWORD_HASH` | Bcrypt hash of the account password   |

## Handle Verification

Bluesky verifies control of the handle domain.

**If the handle matches the PDS hostname** (for example, both are `pds.example.com`):

- No extra setup needed. The PDS handles verification automatically.

**If the handle is on a different domain** (for example, handle `alice.example.com`, PDS at `pds.example.com`):

Add a DNS TXT record:

```
_atproto.alice.example.com  TXT  "did=did:web:pds.example.com"
```

Verify with:

```bash
dig TXT _atproto.alice.example.com
```

## Project Structure

```
├── src/
│   └── index.ts          # Worker entry point (re-exports PDS)
├── wrangler.jsonc        # Cloudflare Worker configuration
├── .dev.vars             # Local secrets (not committed)
└── package.json
```

## Troubleshooting

### "PDS not responding"

Ensure the worker is deployed (`npm run deploy`) or the dev server is running (`npm run dev`).

### "Failed to resolve handle"

Check the handle configuration:

- For DNS verification: ensure the TXT record has propagated (`dig TXT _atproto.yourhandle.com`)
- For same-domain handles: ensure the PDS is accessible at `https://yourdomain.com/.well-known/atproto-did`

### Migration issues

If migration fails partway through:

- Run `npm run pds migrate` again to resume from where you left off
- Use `npm run pds migrate -- --clean` to start fresh (only on deactivated accounts)

## Resources

- [AT Protocol Documentation](https://atproto.com)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [@getcirrus/pds Documentation](https://github.com/ascorbic/cirrus/tree/main/packages/pds)
- [Account Migration Guide](https://atproto.com/guides/account-migration)

## License

MIT
