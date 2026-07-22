import type {
  ForgePattern,
} from "@/features/forge-engine";

type PatternCardProps = {
  pattern: ForgePattern;
};

export function PatternCard({
  pattern,
}: PatternCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-6">

      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        Pattern Detected
      </p>

      <h2 className="mt-2 text-xl font-semibold">
        {pattern.title}
      </h2>

      <p className="mt-3 text-muted-foreground">
        {pattern.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">

        <div>

          <p className="text-xs text-muted-foreground">
            Confidence
          </p>

          <p className="font-semibold capitalize">
            {pattern.confidence}
          </p>

        </div>

        <div>

          <p className="text-xs text-muted-foreground">
            Evidence
          </p>

          <p className="font-semibold">
            {pattern.evidenceCount}
          </p>

        </div>

      </div>

      {pattern.recommendation && (

        <div className="mt-6 rounded-xl bg-muted p-4">

          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Recommendation
          </p>

          <p className="mt-2">
            {pattern.recommendation}
          </p>

        </div>

      )}

    </div>
  );
}