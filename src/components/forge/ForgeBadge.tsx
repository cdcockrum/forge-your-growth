import type { ReactNode } from "react";

type ForgeBadgeProps = {
  children: ReactNode;
};

export function ForgeBadge({
  children,
}: ForgeBadgeProps) {
  return (
    <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
      {children}
    </span>
  );
}