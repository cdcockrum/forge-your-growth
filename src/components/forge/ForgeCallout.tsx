import type { ReactNode } from "react";

type ForgeCalloutProps = {
  title: string;
  children: ReactNode;
};

export function ForgeCallout({
  title,
  children,
}: ForgeCalloutProps) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-5">
      <p className="font-semibold">
        {title}
      </p>

      <div className="mt-2 text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  );
}