import type {
  ReactNode,
} from "react";

type ForgeCardProps = {
  children: ReactNode;
  className?: string;
};

export function ForgeCard({
  children,
  className = "",
}: ForgeCardProps) {
  return (
    <div
      className={[
        "rounded-3xl border bg-card p-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}