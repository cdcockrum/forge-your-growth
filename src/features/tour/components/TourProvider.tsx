import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  useRouterState,
} from "@tanstack/react-router";

import {
  TourCard,
} from "@/features/tour/components/TourCard";

import {
  TourOverlay,
} from "@/features/tour/components/TourOverlay";

import {
  closeTour,
  completeTour,
  hasCompletedTour,
  nextTourStep,
  previousTourStep,
  startTour,
  useTourStore,
  type TourDefinition,
  type TourId,
  type TourPlacement,
  type TourStep,
} from "@/features/tour/tour.store";

import {
  areasTour,
  skillsTour,
  todayTour,
  visionTour,
  weekTour,
} from "@/features/tour/tours";

type TourProviderProps = {
  children: ReactNode;
};

type HighlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const TOUR_REGISTRY: Partial<
  Record<TourId, TourDefinition>
> = {
  vision: visionTour,
  areas: areasTour,
  skills: skillsTour,
  week: weekTour,
  today: todayTour,
};

const ROUTE_TOURS: Partial<
  Record<string, TourId>
> = {
  "/vision": "vision",
  "/areas": "areas",
  "/skills": "skills",
  "/plan": "week",
  "/today": "today",
};

const CARD_WIDTH = 384;
const CARD_HEIGHT_ESTIMATE = 330;
const VIEWPORT_PADDING = 16;
const TARGET_PADDING = 10;
const CARD_GAP = 16;

export function TourProvider({
  children,
}: TourProviderProps) {
  const pathname = useRouterState({
    select: (state) =>
      state.location.pathname,
  });

  const {
    activeTourId,
    activeStepIndex,
    open,
  } = useTourStore();

  const [
    highlightRect,
    setHighlightRect,
  ] = useState<HighlightRect | null>(
    null,
  );

  const activeTour =
    activeTourId
      ? TOUR_REGISTRY[
          activeTourId
        ]
      : undefined;

  const activeStep =
    activeTour?.steps[
      activeStepIndex
    ];

  const updateTarget = useCallback(
    (
      step:
        | TourStep
        | undefined,
    ) => {
      if (
        !step?.target ||
        typeof document ===
          "undefined"
      ) {
        setHighlightRect(
          null,
        );

        return;
      }

      const element =
        document.querySelector<HTMLElement>(
          step.target,
        );

      if (!element) {
        setHighlightRect(
          null,
        );

        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      window.setTimeout(() => {
        const rect =
          element.getBoundingClientRect();

        setHighlightRect({
          top:
            rect.top -
            TARGET_PADDING,
          left:
            rect.left -
            TARGET_PADDING,
          width:
            rect.width +
            TARGET_PADDING * 2,
          height:
            rect.height +
            TARGET_PADDING * 2,
        });
      }, 350);
    },
    [],
  );

  useEffect(() => {
    if (
      !open ||
      !activeStep
    ) {
      setHighlightRect(
        null,
      );

      return;
    }

    updateTarget(
      activeStep,
    );

    function handleViewportChange() {
      updateTarget(
        activeStep,
      );
    }

    window.addEventListener(
      "resize",
      handleViewportChange,
    );

    window.addEventListener(
      "scroll",
      handleViewportChange,
      true,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleViewportChange,
      );

      window.removeEventListener(
        "scroll",
        handleViewportChange,
        true,
      );
    };
  }, [
    activeStep,
    open,
    updateTarget,
  ]);

  useEffect(() => {
    if (
      typeof window ===
        "undefined" ||
      open
    ) {
      return;
    }

    const routeTourId =
      ROUTE_TOURS[pathname];

    if (
      !routeTourId ||
      hasCompletedTour(
        routeTourId,
      )
    ) {
      return;
    }

    const timeout =
      window.setTimeout(() => {
        startTour(
          routeTourId,
        );
      }, 700);

    return () => {
      window.clearTimeout(
        timeout,
      );
    };
  }, [
    open,
    pathname,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        closeTour();
      }

      if (
        event.key ===
        "ArrowLeft" &&
        activeStepIndex >
          0
      ) {
        previousTourStep();
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        handleNext();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  });

  const cardPosition =
    useMemo<CSSProperties>(
      () =>
        getCardPosition({
          rect:
            highlightRect,
          placement:
            activeStep?.placement ??
            "bottom",
        }),
      [
        activeStep?.placement,
        highlightRect,
      ],
    );

  function handleNext() {
    if (
      !activeTour ||
      !activeTourId
    ) {
      return;
    }

    const finalStep =
      activeStepIndex >=
      activeTour.steps.length -
        1;

    if (finalStep) {
      completeTour(
        activeTourId,
      );

      return;
    }

    nextTourStep();
  }

  function handleBack() {
    previousTourStep();
  }

  function handleSkip() {
    if (
      activeTourId
    ) {
      completeTour(
        activeTourId,
      );

      return;
    }

    closeTour();
  }

  return (
    <>
      {children}

      {open &&
      activeTour &&
      activeStep ? (
        <TourOverlay>
          {!highlightRect ? (
          <div
            aria-hidden="true"
            className="fixed inset-0 bg-black/65 backdrop-blur-[1px]"
          />
        ) : null}

          {highlightRect ? (
            <div
              aria-hidden="true"
              className="pointer-events-none fixed z-[10001] rounded-2xl ring-2 ring-orange-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.68),0_0_32px_rgba(249,115,22,0.4)]"
              style={{
                top:
                  highlightRect.top,
                left:
                  highlightRect.left,
                width:
                  highlightRect.width,
                height:
                  highlightRect.height,
              }}
            />
          ) : null}

          <TourCard
            step={activeStep}
            stepIndex={
              activeStepIndex
            }
            stepCount={
              activeTour.steps.length
            }
            positionStyle={
              cardPosition
            }
            onBack={
              handleBack
            }
            onNext={
              handleNext
            }
            onSkip={
              handleSkip
            }
          />
        </TourOverlay>
      ) : null}
    </>
  );
}

function getCardPosition({
  rect,
  placement,
}: {
  rect: HighlightRect | null;
  placement: TourPlacement;
}): CSSProperties {
  if (
    typeof window ===
    "undefined"
  ) {
    return {};
  }

  const viewportWidth =
    window.innerWidth;

  const viewportHeight =
    window.innerHeight;

  if (viewportWidth < 640) {
      return {
        left:
          VIEWPORT_PADDING,

        bottom:
          `calc(${VIEWPORT_PADDING}px + env(safe-area-inset-bottom))`,

        top:
          "auto",

        transform:
          "none",
      };
    }

  if (
    !rect ||
    placement === "center"
  ) {
    return {
      top: "50%",
      left: "50%",
      transform:
        "translate(-50%, -50%)",
    };
  }

  const effectiveWidth =
    Math.min(
      CARD_WIDTH,
      viewportWidth -
        VIEWPORT_PADDING * 2,
    );

  const centeredLeft =
    rect.left +
    rect.width / 2 -
    effectiveWidth / 2;

  let top =
    rect.top +
    rect.height +
    CARD_GAP;

  let left =
    centeredLeft;

  if (
    placement === "top"
  ) {
    top =
      rect.top -
      CARD_HEIGHT_ESTIMATE -
      CARD_GAP;
  }

  if (
    placement === "left"
  ) {
    top =
      rect.top +
      rect.height / 2 -
      CARD_HEIGHT_ESTIMATE /
        2;

    left =
      rect.left -
      effectiveWidth -
      CARD_GAP;
  }

  if (
    placement === "right"
  ) {
    top =
      rect.top +
      rect.height / 2 -
      CARD_HEIGHT_ESTIMATE /
        2;

    left =
      rect.left +
      rect.width +
      CARD_GAP;
  }

  const maxLeft =
    viewportWidth -
    effectiveWidth -
    VIEWPORT_PADDING;

  left =
    clamp(
      left,
      VIEWPORT_PADDING,
      Math.max(
        VIEWPORT_PADDING,
        maxLeft,
      ),
    );

  const maxTop =
    viewportHeight -
    CARD_HEIGHT_ESTIMATE -
    VIEWPORT_PADDING;

  top =
    clamp(
      top,
      VIEWPORT_PADDING,
      Math.max(
        VIEWPORT_PADDING,
        maxTop,
      ),
    );

  return {
    top,
    left,
  };
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.min(
    Math.max(
      value,
      minimum,
    ),
    maximum,
  );
}