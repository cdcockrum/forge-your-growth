function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getDateString() {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

type MorningGreetingProps = {
  firstName: string;
};

export function MorningGreeting({
  firstName,
}: MorningGreetingProps) {
  return (
    <section className="animate-reveal space-y-3">
      <div>
        <p className="eyebrow">
          {getGreeting()}
        </p>

        <h1 className="mt-2 text-5xl font-black tracking-tight">
          {firstName}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {getDateString()}
        </p>
      </div>

      <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
        Every practice today is another vote for the
        person you're becoming.
      </p>
    </section>
  );
}