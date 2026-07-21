import type { Vision } from "@/features/vision";

type Props = {
  vision: Vision | null;
};

export function VisionBanner({
  vision,
}: Props) {
  if (!vision) {
    return null;
  }

  return (
    <section className="rounded-3xl border bg-surface p-8">
      <p className="eyebrow">
        Today you continue becoming
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        {vision.identities.map((identity) => (
          <div
            key={identity}
            className="rounded-full bg-foreground px-5 py-2 text-background"
          >
            {identity}
          </div>
        ))}
      </div>
    </section>
  );
}