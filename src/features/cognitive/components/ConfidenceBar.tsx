type ConfidenceBarProps = {
  value: number;
};

export function ConfidenceBar({
  value,
}: ConfidenceBarProps) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span>Confidence</span>

        <span>{value}%</span>
      </div>

      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}