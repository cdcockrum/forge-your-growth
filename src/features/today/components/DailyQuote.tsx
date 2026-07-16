type DailyQuoteProps = {
  quote: string;
};

export function DailyQuote({
  quote,
}: DailyQuoteProps) {
  return (
    <blockquote className="rounded-2xl border border-border bg-surface/50 px-6 py-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        At the anvil
      </p>

      <p className="mt-3 max-w-2xl text-lg font-semibold leading-7 tracking-tight">
        “{quote}”
      </p>
    </blockquote>
  );
}