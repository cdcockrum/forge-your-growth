type ReflectionFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
};

export function ReflectionField({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
}: ReflectionFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium"
      >
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={[
          "w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-60",
        ].join(" ")}
      />
    </div>
  );
}