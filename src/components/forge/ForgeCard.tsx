import type {
  HTMLAttributes,
  ReactNode,
} from "react";

type ForgeCardVariant =
  | "default"
  | "muted"
  | "strong"
  | "dashed";

type ForgeCardPadding =
  | "none"
  | "small"
  | "medium"
  | "large";

type ForgeCardProps =
  HTMLAttributes<HTMLElement> & {
    children: ReactNode;
    variant?: ForgeCardVariant;
    padding?: ForgeCardPadding;
  };

const variantClasses: Record<
  ForgeCardVariant,
  string
> = {
  default:
    "border border-border bg-surface",
  muted:
    "border border-border bg-surface/50",
  strong:
    "border border-foreground bg-foreground text-background",
  dashed:
    "border border-dashed border-border bg-surface/40",
};

const paddingClasses: Record<
  ForgeCardPadding,
  string
> = {
  none: "",
  small: "p-4",
  medium: "p-5 md:p-6",
  large: "p-6 md:p-8",
};

export function ForgeCard({
  children,
  variant = "default",
  padding = "medium",
  className = "",
  ...props
}: ForgeCardProps) {
  return (
    <section
      className={[
        "rounded-2xl",
        variantClasses[variant],
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}