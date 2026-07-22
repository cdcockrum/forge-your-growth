type ForgeConfidenceProps = {
  value: number;
};

export function ForgeConfidence({
  value,
}: ForgeConfidenceProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${value}%`,
          }}
        />
      </div>

      <span className="font-mono text-xs">
        {value}%
      </span>
    </div>
  );
}