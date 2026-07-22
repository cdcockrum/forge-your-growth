type ReflectionScaleOption<T extends string> = {
  label: string;
  value: T;
};

type ReflectionScaleProps<T extends string> = {
  label: string;
  value: T;
  options: ReflectionScaleOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function ReflectionScale<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: ReflectionScaleProps<T>) {
  return (
    <fieldset
      className="space-y-3"
      disabled={disabled}
    >
      <legend className="text-sm font-medium">
        {label}
      </legend>

      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected =
            option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() =>
                onChange(option.value)
              }
              className={[
                "min-h-11 rounded-xl border px-3 py-2 text-sm font-medium transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-muted",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}