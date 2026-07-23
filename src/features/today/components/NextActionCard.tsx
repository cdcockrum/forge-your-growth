import {
  ArrowRight,
} from "lucide-react";

import {
  ForgeButton,
  ForgeCard,
} from "@/components/forge";

type NextActionCardProps = {
  title: string;
  duration?: number | null;
  identity?: string | null;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function NextActionCard({
  title,
  duration,
  identity,
  description,
  actionLabel = "Begin Practice",
  onAction,
}: NextActionCardProps) {
  return (
    <ForgeCard className="overflow-hidden p-0">
      <div className="p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Today&apos;s Focus
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-tight">
          {title}
        </h2>

        {duration ? (
          <p className="mt-2 text-lg text-muted-foreground">
            {duration}{" "}
            {duration === 1
              ? "minute"
              : "minutes"}
          </p>
        ) : null}

        <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
          {description}
        </p>

        {identity ? (
          <div className="mt-6 rounded-2xl border bg-background p-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Identity evidence
            </p>

            <p className="mt-2 text-lg font-semibold">
              This strengthens your{" "}
              <span className="font-black">
                {identity}
              </span>{" "}
              identity.
            </p>
          </div>
        ) : null}

        <ForgeButton
          type="button"
          onClick={onAction}
          className="mt-8 min-h-11 gap-3"
        >
          {actionLabel}

          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4"
          />
        </ForgeButton>
      </div>
    </ForgeCard>
  );
}