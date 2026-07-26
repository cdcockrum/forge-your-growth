import type {
  ReactNode,
} from "react";

type TourOverlayProps = {
  children: ReactNode;
};

export function TourOverlay({
  children,
}: TourOverlayProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[10000]">
      <div className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
}