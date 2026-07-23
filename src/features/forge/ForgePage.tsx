import type {
  ReactNode,
} from "react";

type ForgePageProps = {
  children: ReactNode;
};

export function ForgePage({
  children,
}: ForgePageProps) {
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-6 py-8">
      {children}
    </main>
  );
}