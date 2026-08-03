import type {
  CSSProperties,
  ReactNode,
} from "react";

type FadeInProps = {
  children: ReactNode;

  delay?: number;

  className?: string;
};

export function FadeIn({
  children,
  delay = 0,
  className = "",
}: FadeInProps) {
  const style: CSSProperties = {
    animationDelay:
      `${Math.max(
        delay,
        0,
      )}ms`,
  };

  return (
    <div
      className={[
        "animate-reveal",
        "motion-reduce:animate-none",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}