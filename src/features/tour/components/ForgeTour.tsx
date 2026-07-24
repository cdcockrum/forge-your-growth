import {
  useEffect,
} from "react";

import {
  useTour,
} from "../hooks/useTour";

import type {
  TourDefinition,
} from "../types";

import {
  Spotlight,
} from "./Spotlight";

import {
  TourBubble,
} from "./TourBubble";

import {
  TourOverlay,
} from "./TourOverlay";

type ForgeTourProps = {
  tour: TourDefinition;
  autoStart?: boolean;
};

export function ForgeTour({
  tour,
  autoStart = true,
}: ForgeTourProps) {
  const {
    open,
    current,
    index,
    total,
    next,
    previous,
    close,
  } = useTour(tour, {
    autoStart,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        close();
        return;
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        next();
        return;
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        previous();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    close,
    next,
    previous,
  ]);

  if (
    !open ||
    !current
  ) {
    return null;
  }

  return (
    <TourOverlay>
      {current.target ? (
        <Spotlight
          target={
            current.target
          }
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm"
        />
      )}

      <TourBubble
        title={
          current.title
        }
        description={
          current.description
        }
        current={index}
        total={total}
        placement={
          current.placement
        }
        completion={
          current.completion
        }
        onNext={next}
        onPrevious={
          previous
        }
        onClose={close}
      />
    </TourOverlay>
  );
}