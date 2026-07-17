import { getGreeting } from "@/features/today";

type TodayProfile = {
  full_name: string | null;
};

type TodayHeaderProps = {
  profile: TodayProfile | null;
};

export function TodayHeader({
  profile,
}: TodayHeaderProps) {
  const now = new Date();

  const firstName =
    profile?.full_name?.trim().split(/\s+/)[0] || "there";

  const formattedDate = now.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <header className="mb-8">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        {formattedDate}
      </p>

      <h1 className="mt-2 text-5xl font-extrabold tracking-tight">
        {getGreeting(now)}, {firstName}.
      </h1>
    </header>
  );
}