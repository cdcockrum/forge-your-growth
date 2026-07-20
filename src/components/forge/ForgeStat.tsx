import type { ReactNode } from "react";

type ForgeStatProps = {
  label: string;
  value: ReactNode;
  subtitle?: ReactNode;
  accent?: ReactNode;
  align?: "left" | "center";
};

export function ForgeStat({
  label,
  value,
  subtitle,
  accent,
  align = "left",
}: ForgeStatProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-background p-5 ${
        align === "center" ? "text-center" : ""
      }`}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>

      <div className="mt-3 text-4xl font-extrabold tracking-tight">
        {value}
      </div>

      {subtitle && (
        <div className="mt-2 text-sm text-muted-foreground">
          {subtitle}
        </div>
      )}

      {accent && (
        <div className="mt-4">
          {accent}
        </div>
      )}
    </div>
  );
}