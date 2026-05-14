/**
 * RolesGrid.tsx
 *
 * Site-side React component that renders the four RoleCard molecules
 * with their Lucide icon slots. Lives in the site repo because:
 *   - Lucide is a direct site dep (not re-exported by @poukai/ui per masterplan 2A)
 *   - JSX in Astro frontmatter can't resolve dynamic component names
 *
 * Rendered as static HTML at build time — no hydration directive used.
 */

import { RoleCard } from "@poukai/ui";
import { Hammer, Workflow, GraduationCap, Clapperboard } from "lucide-react";

type IconName = "hammer" | "workflow" | "graduation-cap" | "clapperboard";

interface Role {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  hiredBy: string;
  icon: IconName;
}

interface RolesGridProps {
  roles: Role[];
}

/** Resolve the Lucide icon element for a given icon name per D-06. */
function RoleIcon({ name }: { name: IconName }) {
  const iconProps = { size: 28, "aria-hidden": true as const };
  if (name === "hammer")         return <Hammer {...iconProps} />;
  if (name === "workflow")       return <Workflow {...iconProps} />;
  if (name === "graduation-cap") return <GraduationCap {...iconProps} />;
  if (name === "clapperboard")   return <Clapperboard {...iconProps} />;
  return null;
}

export function RolesGrid({ roles }: RolesGridProps) {
  return (
    <div className="roles-grid">
      {roles.map((role) => (
        <div key={role.id} id={role.id}>
          <RoleCard
            eyebrow={role.eyebrow}
            title={role.title}
            body={role.body}
            hiredBy={`Hired by: ${role.hiredBy}`}
            icon={<RoleIcon name={role.icon} />}
          />
        </div>
      ))}
    </div>
  );
}
