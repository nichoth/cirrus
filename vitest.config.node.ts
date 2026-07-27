import { defineConfig } from "vitest/config";

/**
 * Plain-node suites: the oauth-provider module and the create-pds
 * scaffolder. These do not need the workers runtime, so they stay out of
 * the pool used by vitest.config.ts.
 */
export default defineConfig({
	test: {
		environment: "node",
		include: ["test/oauth-provider/**/*.test.ts", "test/create-pds.test.ts"],
		globals: true,
	},
});
