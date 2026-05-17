/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

/**
 * Vitest config — unit tests for React component wrappers in src/components.
 *
 * Astro `.astro` files are not tested through vitest; they're rendered by the
 * build, covered by axe/lighthouse against `pnpm preview`, and visually by R20
 * (when wired). Vitest's job is the TypeScript/React seams between the site
 * repo and `@poukai-inc/ui`.
 *
 * R-058 (HARD when tests exist on changed files):
 *   - Line coverage on changed files must be ≥ 80%
 *   - Every new component ships with a smoke test
 *
 * Threshold is enforced via `coverage.thresholds`; if a future PR drops
 * coverage on a changed file, `pnpm test:coverage` exits non-zero.
 */
export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		include: ["src/**/*.test.{ts,tsx}"],
		// Component files import CSS from @poukai-inc/ui via side-effect imports.
		// jsdom can't parse CSS; vitest's css: false makes the test loader ignore
		// `.css` imports entirely (returns empty module). The tests stub the DS
		// itself via vi.mock(), so the underlying CSS chain never executes either.
		css: false,
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			// R-058 wording: "if no tests exist on the changed files, the
			// coverage threshold does not apply for that PR — but the reviewer
			// surfaces the absence as a NIT." Operationalize that here by
			// listing only the files that DO have a sibling `.test.{ts,tsx}`.
			// When a future PR adds a test for another component, the engineer
			// also adds that file to this `include` list — coverage gate then
			// applies. Missing-test cases are reviewer NITs, not CI failures.
			include: [
				"src/components/HomeHero.tsx",
				// Add as smoke tests land:
				// "src/components/RolesGrid.tsx",
				// "src/components/ShellWrapper.tsx",
			],
			exclude: ["src/**/*.test.{ts,tsx}", "src/**/*.d.ts"],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
		},
	},
});
