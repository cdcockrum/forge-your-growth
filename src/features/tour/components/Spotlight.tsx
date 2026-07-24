import {
  useEffect,
  useState,
} from "react";

type SpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type SpotlightProps = {
  target: string;
  padding?: number;
};

export function Spotlight({
  target,
  padding = 10,
}: SpotlightProps) {
  const [rect, setRect] =
    useState<SpotlightRect | null>(null);

  useEffect(() => {
    let scrollTimer: number | undefined;

    function findTarget() {
      return document.querySelector<HTMLElement>(
        target,
      );
    }

    function updatePosition() {
      const element = findTarget();

      if (!element) {
        setRect(null);
        return;
      }

      const bounds =
        element.getBoundingClientRect();

      const left = Math.max(
        8,
        bounds.left - padding,
      );

      const top = Math.max(
        8,
        bounds.top - padding,
      );

      const availableWidth =
        window.innerWidth - left - 8;

      const availableHeight =
        window.innerHeight - top - 8;

      setRect({
        top,
        left,
        width: Math.min(
          bounds.width + padding * 2,
          availableWidth,
        ),
        height: Math.min(
          bounds.height + padding * 2,
          availableHeight,
        ),
      });
    }

    const element = findTarget();

    if (!element) {
      setRect(null);
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    const animationFrame =
      window.requestAnimationFrame(
        updatePosition,
      );

    scrollTimer = window.setTimeout(
      updatePosition,
      350,
    );

    window.addEventListener(
      "resize",
      updatePosition,
    );

    window.addEventListener(
      "scroll",
      updatePosition,
      true,
    );

    const resizeObserver =
      new ResizeObserver(
        updatePosition,
      );

    resizeObserver.observe(element);

    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );

      if (
        scrollTimer !== undefined
      ) {
        window.clearTimeout(
          scrollTimer,
        );
      }

      window.removeEventListener(
        "resize",
        updatePosition,
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true,
      );

      resizeObserver.disconnect();
    };
  }, [
    target,
    padding,
  ]);

  if (!rect) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[10000] bg-black/65"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[10000] rounded-3xl border-2 border-background/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.70),0_0_36px_rgba(255,255,255,0.20)] transition-all duration-500 ease-in-out"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
    >
      <div className="absolute inset-0 animate-pulse rounded-[inherit] ring-2 ring-background/30" />
    </div>
  );
}