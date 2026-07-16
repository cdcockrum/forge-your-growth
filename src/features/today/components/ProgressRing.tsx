type ProgressRingProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

export function ProgressRing({
  value,
  size = 132,
  strokeWidth = 10,
  label = "Complete",
}: ProgressRingProps) {
  const normalizedValue = Math.min(
    100,
    Math.max(0, value),
  );

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (normalizedValue / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={`${normalizedValue}% ${label.toLowerCase()}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-accent transition-[stroke-dashoffset] duration-500"
        />
      </svg>

      <div className="absolute text-center">
        <p className="text-2xl font-extrabold tracking-tight">
          {normalizedValue}%
        </p>

        <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}