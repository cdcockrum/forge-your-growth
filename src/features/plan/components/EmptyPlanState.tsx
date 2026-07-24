import {
  Link,
} from "@tanstack/react-router";

import {
  Sparkles,
} from "lucide-react";

import {
  ForgeButton,
  ForgeCard,
} from "@/components/forge";

export function EmptyPlanState() {
  return (
    <ForgeCard className="py-16 text-center">
      <Sparkles className="mx-auto mb-5 size-8 text-muted-foreground" />

      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        Your first week
      </p>

      <h2 className="mt-3 text-3xl font-bold tracking-tight">
        Create your first skill.
      </h2>

      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
        Define something you want to
        practice. Forge will
        automatically generate and
        assess your first week.
      </p>

      <div className="mt-8">
        <Link to="/skills">
          <ForgeButton size="large">
            Add first skill
          </ForgeButton>
        </Link>
      </div>
    </ForgeCard>
  );
}