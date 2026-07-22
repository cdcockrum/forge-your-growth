type AdvisorCardProps = {
  title: string;
  message: string;
};

export function AdvisorCard({
  title,
  message,
}: AdvisorCardProps) {
  return (
    <div className="rounded-2xl border bg-primary/5 p-6">
      <p className="text-xs uppercase tracking-wide text-primary">
        Forge Advisor
      </p>

      <h2 className="mt-2 text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 leading-relaxed">
        {message}
      </p>
    </div>
  );
}