---
title: Contributing
description: How to set up the Cirrus repository for development, run the tests, and propose changes.
---

Cirrus is open source. Contributions are welcome.

## Repository layout

The repository is a single npm package:

```
cirrus/
├── packages/
│   ├── pds/                  @getcirrus/pds — the main PDS library
│   ├── oauth-provider/       @getcirrus/oauth-provider — OAuth 2.1 server
│   └── create-pds/           create-pds — scaffolding CLI
├── demos/
│   └── pds/                  Demo deployment used in development
├── docs/                     This documentation site (Starlight)
└── plans/                    Planning docs (complete, in-progress, todo)
```

Each package builds with `tsdown` (ESM + .d.ts output). Tests use `vitest`.

## Set up

Clone and install:

```bash
git clone https://github.com/ascorbic/cirrus.git
cd cirrus
npm install
```

A single install pulls every dependency. Node 20 or later is required.

## Build

From the repository root:

```bash
npm run build
```

This builds every package in dependency order.

For watch mode on a single package:

```bash
cd .
npm run dev
```

## Test

Run every test:

```bash
npm test
```

The PDS package uses `vitest 4` with `@cloudflare/vitest-pool-workers`. Tests run inside a real Cloudflare Workers runtime via `workerd`, including SQLite-backed Durable Objects. No mocks.

Run only the PDS unit tests:

```bash
cd .
npm test
```

Run the CLI tests (which exercise `pds init` and friends):

```bash
cd .
npm run test:cli
```

Run end-to-end tests (which spin up a real Cirrus PDS against a real Cloudflare account; gated):

```bash
cd .
npm run test:e2e
```

## Type-check and lint

```bash
npm run check
```

This runs the type-checker and lint on every package.

## Format

```bash
npm run format
```

Prettier with tab indentation. Configured in `.prettierrc`.

## Style notes

The codebase prefers:

- `@atcute` packages over `@atproto` packages where both exist. The CLAUDE.md file documents the rules.
- Named imports over namespace imports (required for `verbatimModuleSyntax`).
- ESM-only output. `import` everywhere.
- No comments that restate what the code does. Comments are reserved for non-obvious "why".
- The smallest change that achieves the goal. No speculative abstractions.

## Working with the docs

The docs site lives in `docs/`. It is a Starlight project.

To run the docs locally:

```bash
cd docs
npm run dev
```

Edit Markdown files under `docs/src/content/docs/`. The site reloads automatically.

The sidebar is configured in `docs/astro.config.mjs`. New pages must be added there to appear in navigation.

The writing style follows the [Astro docs style guide](https://contribute.docs.astro.build/guides/writing-style/): neutral imperative voice, no "we/us/let's", short sentences, opinionated instructions where a choice has to be made.

## Submitting changes

1. Open an issue first for non-trivial changes. A short discussion saves duplicate work.
2. Fork the repository.
3. Create a branch.
4. Make the change. Include tests where applicable.
5. Run `npm run check` and `npm test`.
6. Add a changeset describing the change (`npx changeset`). Changesets describe the user-visible behaviour change, not the implementation.
7. Open a pull request.

The plan documents in `plans/` are useful context for understanding the current direction.

## License

MIT.
