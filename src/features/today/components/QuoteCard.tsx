import {
  DailyQuote,
  getDailyQuote,
} from "@/features/today";

export function QuoteCard() {
  const now = new Date();

  return (
    <div className="mb-8">
      <DailyQuote
        quote={getDailyQuote(now)}
      />
    </div>
  );
}