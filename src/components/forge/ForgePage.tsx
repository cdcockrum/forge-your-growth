import type { ReactNode } from "react";

type ForgePageProps = {
  children: ReactNode;
};

export function ForgePage({
  children,
}: ForgePageProps) {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-16 pt-8 md:px-10 md:pt-12">
      {children}
    </main>
  );
}