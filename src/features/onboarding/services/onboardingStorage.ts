const ONBOARDING_STORAGE_KEY =
  "forge:onboarding-completed";

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.localStorage.getItem(
      ONBOARDING_STORAGE_KEY,
    ) === "true"
  );
}

export function completeOnboarding(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ONBOARDING_STORAGE_KEY,
    "true",
  );
}

export function resetOnboarding(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    ONBOARDING_STORAGE_KEY,
  );
}

export function getPostAuthDestination():
  | "/onboarding"
  | "/today" {
  return hasCompletedOnboarding()
    ? "/today"
    : "/onboarding";
}