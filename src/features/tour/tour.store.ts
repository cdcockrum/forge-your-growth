import {
  useSyncExternalStore,
} from "react";

export type TourId =
  | "vision"
  | "areas"
  | "skills"
  | "week"
  | "today"
  | "advisor"
  | "observatory"
  | "intelligence"
  | "dashboard"
  | "progress"
  | "journey"
  | "review"
  | "timeline";

export type TourPlacement =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "center";

export type TourStep = {
  id: string;
  title: string;
  description: string;
  target?: string;
  placement?: TourPlacement;
  allowInteraction?: boolean;
  waitForTarget?: boolean;
};

export type TourDefinition = {
  id: TourId;
  name: string;
  steps: TourStep[];
  nextTourId?: TourId;
  nextRoute?: string;
};

type TourState = {
  activeTourId: TourId | null;
  activeStepIndex: number;
  open: boolean;
};

const INITIAL_STATE: TourState = {
  activeTourId: null,
  activeStepIndex: 0,
  open: false,
};

let state: TourState = INITIAL_STATE;

const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => {
    listener();
  });
}

function updateState(
  updater:
    | Partial<TourState>
    | ((
        current: TourState,
      ) => TourState),
) {
  state =
    typeof updater === "function"
      ? updater(state)
      : {
          ...state,
          ...updater,
        };

  emitChange();
}

function subscribe(
  listener: () => void,
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return INITIAL_STATE;
}

export function useTourStore() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}

export function startTour(
  tourId: TourId,
  stepIndex = 0,
) {
  updateState({
    activeTourId: tourId,
    activeStepIndex: stepIndex,
    open: true,
  });
}

export function closeTour() {
  updateState({
    open: false,
    activeTourId: null,
    activeStepIndex: 0,
  });
}

export function setTourStep(
  stepIndex: number,
) {
  updateState({
    activeStepIndex: Math.max(
      0,
      stepIndex,
    ),
  });
}

export function nextTourStep() {
  updateState((current) => ({
    ...current,
    activeStepIndex:
      current.activeStepIndex + 1,
  }));
}

export function previousTourStep() {
  updateState((current) => ({
    ...current,
    activeStepIndex: Math.max(
      0,
      current.activeStepIndex - 1,
    ),
  }));
}

export function getTourStorageKey(
  tourId: TourId,
) {
  return `forge-tour:${tourId}:completed`;
}

export function hasCompletedTour(
  tourId: TourId,
) {
  if (
    typeof window === "undefined"
  ) {
    return false;
  }

  return (
    window.localStorage.getItem(
      getTourStorageKey(tourId),
    ) === "true"
  );
}

export function completeTour(
  tourId: TourId,
) {
  if (
    typeof window !== "undefined"
  ) {
    window.localStorage.setItem(
      getTourStorageKey(tourId),
      "true",
    );
  }

  closeTour();
}

export function resetTour(
  tourId: TourId,
) {
  if (
    typeof window !== "undefined"
  ) {
    window.localStorage.removeItem(
      getTourStorageKey(tourId),
    );
  }
}

export function resetAllTours() {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  const tourIds: TourId[] = [
    "vision",
    "areas",
    "skills",
    "week",
    "today",
    "advisor",
    "observatory",
    "intelligence",
    "dashboard",
    "progress",
    "journey",
    "review",
    "timeline",
  ];

  tourIds.forEach((tourId) => {
    window.localStorage.removeItem(
      getTourStorageKey(tourId),
    );
  });

  closeTour();
}