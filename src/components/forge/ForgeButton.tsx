import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ForgeButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ForgeButtonSize =
  | "small"
  | "medium"
  | "large";

type ForgeButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    variant?: ForgeButtonVariant;
    size?: ForgeButtonSize;
    fullWidth?: boolean;
  };

const variantClasses: Record<
  ForgeButtonVariant,
  string
> = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90",
  secondary:
    "border border-border bg-background text-foreground hover:bg-muted",
  ghost:
    "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  danger:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizeClasses: Record<
  ForgeButtonSize,
  string
> = {
  small: "h-8 px-3 text-xs",
  medium: "h-10 px-4 text-sm",
  large: "h-11 px-5 text-sm",
};

export function ForgeButton({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ForgeButtonProps) {
  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}