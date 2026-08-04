import type {
  ReactNode,
} from "react";

type MetricGridProps = {
  children: ReactNode;

  columns?:
    | 2
    | 3
    | 4;

  className?: string;
};

export function MetricGrid({
  children,
  columns = 4,
  className = "",
}: MetricGridProps) {
  return (
    <div
      className={[
        "grid gap-4",
        columnClassName(
          columns,
        ),
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function columnClassName(
  columns:
    NonNullable<
      MetricGridProps["columns"]
    >,
): string {
  switch (columns) {
    case 2:
      return "sm:grid-cols-2";

    case 3:
      return [
        "sm:grid-cols-2",
        "xl:grid-cols-3",
      ].join(" ");

    case 4:
    default:
      return [
        "sm:grid-cols-2",
        "xl:grid-cols-4",
      ].join(" ");
  }
}