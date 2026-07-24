const TOUR_PREFIX =
  "forge-tour:";

function getTourKey(
  id: string,
) {
  return `${TOUR_PREFIX}${id}`;
}

export function hasCompletedTour(
  id: string,
): boolean {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  return (
    window.localStorage.getItem(
      getTourKey(id),
    ) === "true"
  );
}

export function completeTour(
  id: string,
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.setItem(
    getTourKey(id),
    "true",
  );
}

export function resetTour(
  id: string,
): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.localStorage.removeItem(
    getTourKey(id),
  );
}

export function resetAllTours(): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  Object.keys(
    window.localStorage,
  )
    .filter((key) =>
      key.startsWith(
        TOUR_PREFIX,
      ),
    )
    .forEach((key) => {
      window.localStorage.removeItem(
        key,
      );
    });
}