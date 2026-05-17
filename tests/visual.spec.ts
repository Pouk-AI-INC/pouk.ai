import { test } from "@playwright/test";
import { argosScreenshot } from "@argos-ci/playwright";

/**
 * Visual regression — full-page snapshots of every public route.
 *
 * Each route is captured once per Playwright project (mobile + desktop, see
 * `playwright.config.ts`). Argos uses the project name + screenshot name as
 * the identity key, so the same route at different viewports diffs separately.
 *
 * `argosScreenshot` stabilizes the page (waits for fonts, hides caret blink,
 * disables animations) before capture — keeps cross-runner diffs to true
 * visual changes rather than render-timing noise.
 */
const routes = [
  { name: "home", path: "/" },
  { name: "why-ai", path: "/why-ai/" },
  { name: "roles", path: "/roles/" },
  { name: "principles", path: "/principles/" },
];

for (const route of routes) {
  test(`route: ${route.name}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await argosScreenshot(page, route.name, { fullPage: true });
  });
}
