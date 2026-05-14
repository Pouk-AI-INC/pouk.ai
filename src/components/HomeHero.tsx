/**
 * HomeHero.tsx
 *
 * Thin React wrapper that assembles the homepage Hero with its complex JSX slots.
 * Lives in the site repo because passing JSX as a prop from an .astro file to a
 * React component causes esbuild to parse the .astro template as TypeScript, which
 * breaks on HTML attributes in the <head>. By wrapping here, index.astro passes
 * only scalar props across the boundary (same pattern as ShellWrapper.tsx).
 *
 * Decisions honoured:
 *   D-11 — integrated lede-extension link sentence at end of lede, href="/why-ai".
 *           Structural form locked. Exact wording is Draft: Arian approves final copy.
 *   D-12 — status-line text verbatim from public/index.html (now deleted):
 *           "Currently taking conversations for Q3."
 *
 * Rendered as static HTML at build time — no hydration directive (R-079).
 */

import { Hero, StatusBadge, Button } from "@poukai-inc/ui";

export function HomeHero() {
  return (
    <Hero
      status={
        /* D-12: byte-identical to the former public/index.html status line */
        <StatusBadge status="available">Currently taking conversations for Q3.</StatusBadge>
      }
      title={
        /* Verbatim tagline from public/index.html — <em>AI</em> preserved */
        <>Technical consulting for teams shipping with <em>AI</em>.</>
      }
      lede={
        /*
         * Lede verbatim from public/index.html, with the D-11 integrated link
         * sentence appended as the final sentence of the lede.
         *
         * Draft: per D-11 — Arian approves final copy.
         * Structural lock: single integrated link sentence, href="/why-ai",
         * not a tertiary line below the CTA (rejected alternative per spec §5).
         */
        <>
          pouk.ai builds custom AI systems, automations, and advisory
          engagements for operators who&rsquo;d rather ship than speculate.
          Named for Pou&#257;kai &mdash; the largest eagle that ever flew,
          hunting by stooping from height.{" "}
          Most AI projects fail to deliver.{" "}
          <a href="/why-ai">Here&rsquo;s why &rarr;</a>
        </>
      }
      cta={
        <Button asChild>
          <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
        </Button>
      }
    />
  );
}
