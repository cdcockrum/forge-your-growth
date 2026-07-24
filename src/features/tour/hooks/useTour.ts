import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  completeTour,
  hasCompletedTour,
} from "../services/tourStorage";

import type {
  TourDefinition,
} from "../types";

type UseTourOptions = {
  autoStart?: boolean;
};

export function useTour(
  tour: TourDefinition,
  options: UseTourOptions = {},
) {
  const {
    autoStart = true,
  } = options;

  const [
    index,
    setIndex,
  ] = useState(0);

  const [
    open,
    setOpen,
  ] = useState(false);

  useEffect(() => {
    if (
      !autoStart
    ) {
      return;
    }

    const completed =
      hasCompletedTour(
        tour.id,
      );

    if (!completed) {
      setOpen(true);
    }
  }, [
    autoStart,
    tour.id,
  ]);

  const finish =
    useCallback(() => {
      completeTour(
        tour.id,
      );

      setOpen(false);
      setIndex(0);
    }, [
      tour.id,
    ]);

  function next() {
    if (
      index <
      tour.steps.length - 1
    ) {
      setIndex(
        (current) =>
          current + 1,
      );

      return;
    }

    finish();
  }

  function previous() {
    setIndex(
      (current) =>
        Math.max(
          current - 1,
          0,
        ),
    );
  }

  function close() {
    finish();
  }

  function start() {
    setIndex(0);
    setOpen(true);
  }

  const current =
    tour.steps[index];

  return {
    open,
    current,
    index,
    total:
      tour.steps.length,
    next,
    previous,
    close,
    start,
    finish,
  };
}