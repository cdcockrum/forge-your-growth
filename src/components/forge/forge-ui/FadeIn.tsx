import type {
  CSSProperties,
  ReactNode,
} from "react";

type FadeInProps = {
  children: ReactNode;

  delay?: number;

  duration?: number;

  distance?: number;

  className?: string;
};

export function FadeIn({
  children,
  delay = 0,
  duration = 650,
  distance = 18,
  className = "",
}: FadeInProps) {
  const style = {
    "--forge-reveal-delay":
      `${Math.max(delay, 0)}ms`,

    "--forge-reveal-duration":
      `${Math.max(duration, 0)}ms`,

    "--forge-reveal-distance":
      `${Math.max(distance, 0)}px`,
  } as CSSProperties;

  return (
    <div
      className={[
        "forge-reveal",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}