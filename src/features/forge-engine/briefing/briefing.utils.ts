export function clamp(
  value: number,
  minimum = 0,
  maximum = 1,
): number {
  return Math.min(maximum, Math.max(minimum, value));
}

export function average(
  values: number[],
): number {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (total, value) => total + value,
      0,
    ) / values.length
  );
}

export function createBriefingId(
  prefix: string,
  value: string,
): string {
  const normalizedValue = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${prefix}-${normalizedValue || "item"}`;
}

export function getGreeting(
  date: Date,
  userName?: string,
): string {
  const hour = date.getHours();

  let greeting: string;

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  } else {
    greeting = "Good evening";
  }

  return userName
    ? `${greeting}, ${userName}.`
    : `${greeting}.`;
}