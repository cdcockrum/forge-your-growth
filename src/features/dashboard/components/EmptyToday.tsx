import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type EmptyTodayProps = {
  hasSkills: boolean;
};

export function EmptyToday({
  hasSkills,
}: EmptyTodayProps) {
  const destination = hasSkills
    ? "/plan"
    : "/skills";

  const message = hasSkills
    ? "No practice is scheduled for today."
    : "You haven't added any skills yet.";

  const actionLabel = hasSkills
    ? "Plan your week"
    : "Add a skill";

  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
      <p className="mb-4 text-sm text-muted-foreground">
        {message}
      </p>

      <Link
        to={destination}
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
      >
        {actionLabel}
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}