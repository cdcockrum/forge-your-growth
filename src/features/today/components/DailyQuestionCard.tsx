const QUESTIONS = [
  "What moved you closer to your Vision today?",
  "Where did you act according to your values?",
  "What challenged your identity today?",
  "What deserves your attention tomorrow?",
];

export function DailyQuestionCard() {
  const day =
    new Date().getDate() % QUESTIONS.length;

  return (
    <section className="rounded-3xl border bg-surface p-8">
      <p className="eyebrow">
        Reflection Tonight
      </p>

      <p className="mt-4 text-xl leading-relaxed">
        {QUESTIONS[day]}
      </p>
    </section>
  );
}