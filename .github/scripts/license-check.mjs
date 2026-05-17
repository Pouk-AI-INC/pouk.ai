#!/usr/bin/env node
/**
 * license-check.mjs — R-064 gate (production dependencies only)
 *
 * Reads `pnpm licenses list --prod --json` from stdin and fails (exit 1)
 * if any production dep is licensed outside the allow-list AND outside
 * the documented exception list.
 *
 * Allow-list — the standard R-064 named set plus widely-accepted permissive
 * equivalents. Adding a license here is a policy change; tighten through the
 * standards doc (`meta/standards/technical-requirements.md`) first.
 *
 * Exception list — per-(package, license) entries for individual packages
 * where the license isn't on the allow-list but use is legitimate. Each
 * entry must carry a one-line rationale. Adding an exception is a policy
 * change too; surface in PR description for reviewer sign-off.
 *
 * The script prints a per-license summary on success so reviewers can eyeball
 * the dep tree without re-running `pnpm licenses list` by hand.
 */

const ALLOW = new Set([
	// Standard R-064 named set.
	"MIT",
	"Apache-2.0",
	"ISC",
	"BSD-2-Clause",
	"BSD-3-Clause",
	// Community-accepted permissive equivalents.
	"0BSD",
	"BlueOak-1.0.0",
	"CC0-1.0",
	"Python-2.0",
	"Unlicense",
	// Common SPDX compound expressions that are effectively allow-list.
	"(MIT OR CC0-1.0)",
	"CC0 1.0 OR MIT",
]);

/**
 * Exceptions — `${name}@${license}` keys. Match on package name + exact license
 * string. Versions intentionally not pinned; if a transitive bumps versions, the
 * exception still applies. If a license string changes, the exception lapses
 * and the package re-enters the gate (correct behavior — re-review needed).
 */
const EXCEPTIONS = {
	"@poukai-inc/ui@UNLICENSED":
		"First-party proprietary DS package. UNLICENSED here means private/internal, not 'no license' in the OSS sense.",
	"@vercel/analytics@MPL-2.0":
		"Vercel Web Analytics client SDK. MPL-2.0 is per-file copyleft and only triggers on modification of MPL source files; we consume the package as-is, no source modification. Same rationale as the lightningcss entries below.",
	"@img/sharp-libvips-darwin-arm64@LGPL-3.0-or-later":
		"libvips native binary used by sharp via dynamic linking; LGPL explicitly permits this distribution shape. macOS arm64 only — Linux variants ship a different binary.",
	"@img/sharp-libvips-darwin-x64@LGPL-3.0-or-later":
		"libvips native binary (Intel macOS variant). Same dynamic-linking rationale as the arm64 entry.",
	"@img/sharp-libvips-linux-x64@LGPL-3.0-or-later":
		"libvips native binary (Linux x64 variant — used by Vercel build runners). Same rationale.",
	"@img/sharp-libvips-linux-arm64@LGPL-3.0-or-later":
		"libvips native binary (Linux arm64 variant). Same rationale.",
	"caniuse-lite@CC-BY-4.0":
		"Browser-compat database. CC-BY-4.0 requires attribution; the npm package metadata satisfies the attribution requirement. R-064 forbids CC-BY-NC specifically, not CC-BY.",
	"lightningcss@MPL-2.0":
		"Used by astro-compress for CSS minification. MPL-2.0 is per-file copyleft and only triggers on modification of MPL source files; we use the package as a binary, no source modification.",
	"lightningcss-darwin-arm64@MPL-2.0":
		"Native binary variant of lightningcss for macOS arm64.",
	"lightningcss-darwin-x64@MPL-2.0":
		"Native binary variant of lightningcss for Intel macOS.",
	"lightningcss-linux-x64-gnu@MPL-2.0":
		"Native binary variant of lightningcss for Linux x64 (Vercel build runners).",
	"lightningcss-linux-x64-musl@MPL-2.0":
		"Native binary variant of lightningcss for Linux x64 (musl).",
	"lightningcss-linux-arm64-gnu@MPL-2.0":
		"Native binary variant of lightningcss for Linux arm64.",
	"lightningcss-linux-arm64-musl@MPL-2.0":
		"Native binary variant of lightningcss for Linux arm64 (musl).",
	"lightningcss-linux-arm-gnueabihf@MPL-2.0":
		"Native binary variant of lightningcss for Linux armhf.",
	"lightningcss-freebsd-x64@MPL-2.0":
		"Native binary variant of lightningcss for FreeBSD x64.",
	"lightningcss-win32-x64-msvc@MPL-2.0":
		"Native binary variant of lightningcss for Windows x64.",
	"lightningcss-win32-arm64-msvc@MPL-2.0":
		"Native binary variant of lightningcss for Windows arm64.",
};

let stdin = "";
process.stdin.on("data", (chunk) => {
	stdin += chunk;
});
process.stdin.on("end", () => {
	let tree;
	try {
		tree = JSON.parse(stdin);
	} catch (err) {
		console.error("Failed to parse `pnpm licenses list --prod --json`:", err.message);
		process.exit(2);
	}

	const offenders = [];
	const summary = [];
	for (const [license, packages] of Object.entries(tree)) {
		const allowed = ALLOW.has(license);
		const names = packages.map((p) => p.name);
		summary.push(`  ${license}: ${packages.length} package(s)`);
		if (allowed) continue;
		for (const pkg of packages) {
			const key = `${pkg.name}@${license}`;
			if (EXCEPTIONS[key]) continue;
			offenders.push({
				name: pkg.name,
				versions: pkg.versions,
				license,
			});
		}
	}

	console.log("License summary (production tree):");
	console.log(summary.sort().join("\n"));
	console.log("");

	if (offenders.length === 0) {
		console.log(
			`All ${Object.values(tree).flat().length} production dependencies satisfy R-064 ` +
				"(allow-list or documented exception).",
		);
		process.exit(0);
	}

	console.error(`::error::${offenders.length} R-064 violation(s) detected:`);
	for (const o of offenders) {
		console.error(`  - ${o.name}@${o.versions.join(",")} — ${o.license}`);
	}
	console.error("");
	console.error("Allow-list:", [...ALLOW].sort().join(", "));
	console.error("");
	console.error(
		"To resolve: either (a) replace the offending package with a permissively-licensed " +
			"alternative, (b) add a (package@license) entry to EXCEPTIONS in this file with a " +
			"one-line rationale and surface in the PR description for reviewer sign-off, or (c) " +
			"propose amending R-064 in meta/standards/technical-requirements.md.",
	);
	process.exit(1);
});
