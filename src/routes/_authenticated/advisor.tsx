import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/advisor")({
  component: AdvisorPage,
});

function AdvisorPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Personal Intelligence
      </p>

      <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
        Advisor
      </h1>

      <p className="mt-3 max-w-2xl text-muted-foreground">
        Your Forge advisor experience is being prepared.
      </p>
    </main>
  );
}