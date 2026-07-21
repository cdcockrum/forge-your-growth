import {
  todayIso,
  weekBounds,
} from "@/features/forge/queries";

type WeeklyStripSession = {
  scheduled_date: string;
  completed: boolean;
};

type WeeklyStripProps = {
  sessions: WeeklyStripSession[];
};

export function WeeklyStrip({
  sessions,
}: WeeklyStripProps) {
  const { start } = weekBounds();
  const today = todayIso();

  const startDate = new Date(start);

  const days = Array.from(
    { length: 7 },
    (_, index) => {
        const date = new Date(startDate);

        date.setDate(
        startDate.getDate() + index,
        );

        return date;
    },
    );

  return (
    <section className="animate-reveal [animation-delay:100ms]">
      <div className="flex justify-between gap-2">
        {days.map((date) => {
          const iso = date
            .toISOString()
            .slice(0, 10);

          const daySessions = sessions.filter(
            (session) =>
              session.scheduled_date === iso,
          );

          const completed =
            daySessions.filter(
              (session) => session.completed,
            ).length;

          const total = daySessions.length;

          const isToday = iso === today;

          return (
            <div
              key={iso}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span
                className={[
                  "font-mono text-[9px] uppercase tracking-widest",
                  isToday
                    ? "text-accent font-bold"
                    : "text-muted-foreground",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {date.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "narrow",
                  },
                )}
              </span>

              <div
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                  isToday
                    ? "border-foreground bg-foreground text-background"
                    : completed === total &&
                      total > 0
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-background",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {date.getDate()}
              </div>

              <span className="text-[10px] text-muted-foreground">
                {completed}/{total}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}