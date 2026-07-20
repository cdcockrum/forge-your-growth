import type { ReactNode } from "react";

type ForgeSidebarLayoutProps = {
  main: ReactNode;
  sidebar: ReactNode;
  className?: string;
  mainClassName?: string;
  sidebarClassName?: string;
};

export function ForgeSidebarLayout({
  main,
  sidebar,
  className = "",
  mainClassName = "",
  sidebarClassName = "",
}: ForgeSidebarLayoutProps) {
  return (
    <div
      className={[
        "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "min-w-0",
          mainClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {main}
      </div>

      <aside
        className={[
          "space-y-4",
          sidebarClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {sidebar}
      </aside>
    </div>
  );
}