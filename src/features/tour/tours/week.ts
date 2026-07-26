import type {
  TourDefinition,
} from "@/features/tour/tour.store";

export const weekTour: TourDefinition = {
  id: "week",
  name: "First Week",

  steps: [
    {
      id: "overview",
      title: "Turn intention into rhythm",
      description:
        "Forge now converts your Vision, Life Areas, and Skills into a sustainable weekly practice plan.",
      target: "[data-tour='week-title']",
      placement: "bottom",
    },

    {
      id: "generate",
      title: "Generate your week",
      description:
        "Forge uses your preferred days, frequency, duration, and difficulty to create practice sessions for the current week.",
      target: "[data-tour='week-generate']",
      placement: "bottom",
      allowInteraction: true,
    },

    {
      id: "assessment",
      title: "Check the balance",
      description:
        "The weekly assessment looks for overload, neglected Skills, and whether your plan is realistic enough to complete.",
      target: "[data-tour='week-assessment']",
      placement: "bottom",
    },

    {
      id: "focus",
      title: "Include real-life commitments",
      description:
        "Focus items capture responsibilities outside deliberate practice, helping Forge see the whole week rather than only your Skills.",
      target: "[data-tour='week-focus']",
      placement: "bottom",
      allowInteraction: true,
    },

    {
      id: "calendar",
      title: "Your weekly rhythm",
      description:
        "Each day contains the practice sessions Forge created. You can start, complete, skip, restore, remove, or manually add sessions.",
      target: "[data-tour='week-calendar']",
      placement: "top",
      allowInteraction: true,
    },

    {
      id: "enter",
      title: "Your Forge is ready",
      description:
        "Once at least one session exists, enter Forge and begin using Today as your daily practice workspace.",
      target: "[data-tour='week-enter']",
      placement: "top",
      allowInteraction: true,
    },
  ],
};