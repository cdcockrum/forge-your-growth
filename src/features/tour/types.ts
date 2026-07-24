export type TourPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

export type TourStep = {
  id: string;
  target?: string;
  title: string;
  description: string;
  placement?: TourPlacement;
  completion?: boolean;
};

export type TourDefinition = {
  id: string;
  name: string;
  steps: TourStep[];
};