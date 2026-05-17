import { defineConfig } from "@playwright/test";

/**
 * Playwright config — visual regression only.
 *
 * Runs the `tests/visual.spec.ts` snapshots against `pnpm preview` at two
 * canonical viewports (mobile 360×640, desktop 1280×800). The Argos reporter
 * uploads each snapshot to Argos for diffing against the baseline branch.
 *
 * This is the only thing Playwright does in this repo — no end-to-end / unit
 * tests live here. Vitest (`pnpm test`) owns logic tests; this owns pixels.
 *
 * @see meta/backlog.md — "Ongoing visual regression for future PRs"
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI
    ? [["@argos-ci/playwright/reporter", { uploadToArgos: true }], ["list"]]
    : [["@argos-ci/playwright/reporter", { uploadToArgos: false }], ["list"]],
  use: {
    baseURL: "http://localhost:4321",
    trace: "off",
    video: "off",
    screenshot: "off",
  },
  webServer: {
    command: "pnpm preview --port 4321",
    url: "http://localhost:4321/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: "ignore",
    stderr: "pipe",
  },
  projects: [
    {
      name: "mobile",
      use: {
        viewport: { width: 360, height: 640 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "desktop",
      use: {
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
});
