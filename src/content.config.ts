import { defineCollection, z } from "astro:content";
import { file } from "astro/loaders";

/* ---------- Stat sub-schema (shared by failure-modes) ---------- */

const statSchema = z.object({
  value: z.string(),
  caption: z.string(),
  source: z.string().optional(),
});

/* ---------- Roles ---------- */

const rolesCollection = defineCollection({
  loader: file("src/content/roles.json"),
  schema: z.object({
    id: z.string(),
    eyebrow: z.string(),
    title: z.string(),
    body: z.string(),
    hiredBy: z.string(),
    icon: z.enum(["hammer", "workflow", "graduation-cap", "clapperboard"]),
  }),
});

/* ---------- Principles ---------- */
// principles.json is a single object (not an array), so we use a custom loader
// approach: wrap in a virtual collection via the file loader by treating the
// whole file as a single "entry". We import it directly in the page instead.
// See src/pages/principles.astro for the direct import pattern.

/* ---------- Failure Modes ---------- */

const failureModesCollection = defineCollection({
  loader: file("src/content/failure-modes.json"),
  schema: z.object({
    index: z.number().int().min(1).max(5),
    title: z.string(),
    anchor: z.string(),
    body: z.string(),
    stats: z.array(statSchema).default([]),
  }),
});

export const collections = {
  roles: rolesCollection,
  "failure-modes": failureModesCollection,
};
