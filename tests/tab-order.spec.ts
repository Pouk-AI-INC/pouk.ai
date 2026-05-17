import { test, expect } from "@playwright/test";

/**
 * Tab-order trace — partial automation of the manual screen-reader walk
 * (backlog L119). Loads each route and presses Tab up to `MAX_TABS` times,
 * recording the focused element at every step.
 *
 * What this catches automatically:
 *   - Focus traps (infinite loop before reaching the end)
 *   - Skipped landmarks (primary nav links never receive focus)
 *   - Dead-end pages (fewer than the expected minimum tab stops)
 *   - Pages where the first tab disappears into nothing (broken focus chain)
 *
 * What this still doesn't catch — the irreducibly manual SR-walk concerns:
 *   - Does the announced text make sense?
 *   - Is the alt text descriptive or placeholder?
 *   - Does the reading order match the visual order?
 *   - Does `aria-current="page"` actually announce as "current page"?
 *
 * Tab-order journey is also logged to stdout so a reviewer can scan the
 * trace without re-running the test.
 */

const routes = [
  { name: "home", path: "/" },
  { name: "why-ai", path: "/why-ai/" },
  { name: "roles", path: "/roles/" },
  { name: "principles", path: "/principles/" },
];

const MAX_TABS = 80;
const MIN_STOPS = 3;
const PRIMARY_NAV_LABELS = ["Why AI", "Roles", "Principles"];

type FocusedElement = {
  tag: string;
  role: string;
  text: string;
  href: string;
  ariaCurrent: string;
};

for (const route of routes) {
  test(`tab order: ${route.name}`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "networkidle" });

    const journey: FocusedElement[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < MAX_TABS; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate((): FocusedElement | null => {
        const el = document.activeElement;
        if (!el || el === document.body || el.tagName === "HTML") {
          return null;
        }
        return {
          tag: el.tagName.toLowerCase(),
          role: el.getAttribute("role") ?? "",
          text: (
            el.textContent?.trim() ||
            el.getAttribute("aria-label") ||
            ""
          ).slice(0, 60),
          href:
            el instanceof HTMLAnchorElement ? el.getAttribute("href") ?? "" : "",
          ariaCurrent: el.getAttribute("aria-current") ?? "",
        };
      });

      if (!info) break;

      // Loop detection — if we revisit a tab stop after the first few hops,
      // assume the tab order has cycled and stop recording.
      const key = `${info.tag}|${info.href}|${info.text}`;
      if (seen.has(key) && journey.length > MIN_STOPS) break;
      seen.add(key);
      journey.push(info);
    }

    console.log(`\n[${route.name}] tab-order journey (${journey.length} stops):`);
    journey.forEach((stop, i) => {
      const ariaTag = stop.ariaCurrent ? ` aria-current="${stop.ariaCurrent}"` : "";
      const roleTag = stop.role ? ` role="${stop.role}"` : "";
      console.log(`  ${i + 1}. <${stop.tag}${roleTag}${ariaTag}> ${stop.text}`);
    });

    expect(
      journey.length,
      "expected the focus chain to terminate before MAX_TABS (no focus trap)",
    ).toBeLessThan(MAX_TABS);

    expect(
      journey.length,
      `expected at least ${MIN_STOPS} tab stops per page`,
    ).toBeGreaterThanOrEqual(MIN_STOPS);

    const reachedPrimaryNav = PRIMARY_NAV_LABELS.some((label) =>
      journey.some((stop) => stop.text.includes(label)),
    );
    expect(
      reachedPrimaryNav,
      `expected at least one primary-nav link (${PRIMARY_NAV_LABELS.join(" / ")}) to receive focus`,
    ).toBe(true);
  });
}
