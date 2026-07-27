import { defineConfig } from "vitest/config";
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";

export default defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: { configPath: "./test/fixtures/pds-worker/wrangler.jsonc" },
			miniflare: {
				bindings: {
					DID: "did:web:pds.test",
					HANDLE: "alice.test",
					PDS_HOSTNAME: "pds.test",
					AUTH_TOKEN: "test-token",
					SIGNING_KEY:
						"e5b452e70de7fb7864fdd7f0d67c6dbd0f128413a1daa1b2b8a871e906fc90cc",
					SIGNING_KEY_PUBLIC:
						"zQ3shbUq6umkAhwsxEXj6fRZ3ptBtF5CNZbAGoKjvFRatUkVY",
					JWT_SECRET: "test-jwt-secret-at-least-32-chars-long",
					PASSWORD_HASH:
						"$2b$10$B6MKXNJ33Co3RoIVYAAvvO3jImuMiqL1T1YnFDN7E.hTZLtbB4SW6",
					// Start accounts active by default in tests
					INITIAL_ACTIVE: "true",
				},
			},
		}),
	],
	resolve: {
		conditions: ["worker", "browser", "node", "require"],
		alias: {
			pino: "pino/browser.js",
		},
	},
	// The worker environment and the dep optimizer resolve separately from
	// resolve.conditions above, and the optimizer prebundles these deps, so
	// the chosen condition gets baked in here. "workerd" must lead so
	// @atcute's #runtime subpath import picks its workerd build; its "node"
	// build uses Buffer.utf8Write, which throws a RangeError inside workerd.
	// "node" and "require" must still follow, so multiformats resolves to CJS.
	ssr: {
		resolve: {
			conditions: ["workerd", "node", "require"],
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			conditions: ["workerd", "node", "require"],
		},
	},
	test: {
		globals: true,
		// Vitest 4: singleWorker is now maxWorkers: 1, isolate: false
		maxWorkers: 1,
		isolate: false,
		// test/cli, test/oauth-provider and test/create-pds.test.ts run in
		// plain node (see vitest.config.cli.ts / vitest.config.node.ts), not
		// in the workers pool.
		// "**/node_modules/**", not "node_modules/**": demos/pds links
		// @getcirrus/pds back to this root via file:../.., so a top-level-only
		// pattern lets the glob recurse through that symlink and rediscover
		// every test file, which crashes the workers pool.
		exclude: [
			"test/cli/**",
			"test/oauth-provider/**",
			"test/create-pds.test.ts",
			"**/node_modules/**",
			"apps/**",
			"docs/**",
			"demos/**",
			"templates/**",
		],
	},
});
