export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date: ${value}`);
  }

  return new Date(year, month - 1, day);
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function differenceInCalendarDays(
  laterDate: Date,
  earlierDate: Date,
): number {
  const laterUtc = Date.UTC(
    laterDate.getFullYear(),
    laterDate.getMonth(),
    laterDate.getDate(),
  );

  const earlierUtc = Date.UTC(
    earlierDate.getFullYear(),
    earlierDate.getMonth(),
    earlierDate.getDate(),
  );

  return Math.round((laterUtc - earlierUtc) / 86_400_000);
}

export function addDays(
  date: Date,
  amount: number,
): Date {
  const result = new Date(date);

  result.setDate(result.getDate() + amount);
  result.setHours(0, 0, 0, 0);

  return result;
}

export function isCompletedSession(
  session: {
    status?: string | null;
    completed: boolean;
  },
): boolean {
  return (
    session.status === "completed" ||
    session.completed === true
  );
}