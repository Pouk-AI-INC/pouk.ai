/**
 * ShellWrapper.tsx
 *
 * Thin React wrapper around SiteShell that owns the footer construction.
 * Lives in the site repo because:
 *   - The footer content (copyright year, contact email) is site-specific.
 *   - Passing JSX as a prop from an .astro file to a React component causes
 *     esbuild to parse the entire .astro template as TypeScript, which breaks
 *     on HTML attributes like <link as="font"> in the <head> section.
 *   - By wrapping SiteShell here, BaseLayout.astro passes only scalar props
 *     (strings, numbers, plain arrays) — no JSX prop values cross the boundary.
 *
 * Rendered as static HTML at build time — no hydration directive (R-079).
 */

import type { ReactNode } from "react";
import { SiteShell } from "@poukai/ui";

interface NavRoute {
  href: string;
  label: string;
}

interface ShellWrapperProps {
  currentRoute: string;
  routes: NavRoute[];
  year: number;
  children: ReactNode;
}

export function ShellWrapper({ currentRoute, routes, year, children }: ShellWrapperProps) {
  return (
    <SiteShell
      currentRoute={currentRoute}
      routes={routes}
      footer={
        <p>
          {"© "}{year}{" pouk.ai · "}
          <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
        </p>
      }
    >
      {children}
    </SiteShell>
  );
}
