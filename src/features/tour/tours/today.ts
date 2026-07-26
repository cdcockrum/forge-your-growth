import type {
  TourDefinition,
} from "@/features/tour/tour.store";

export const todayTour: TourDefinition = {
  id: "today",
  name: "Today",

  steps: [
    {
      id: "welcome",
      title: "This is your daily workspace",
      description:
        "Today brings together your next practice, current focus, reflections, momentum, and the patterns Forge is learning.",
      target: "[data-tour='today-hero']",
      placement: "bottom",
    },

    {
      id: "next-action",
      title: "Take the next meaningful step",
      description:
        "Forge keeps the day focused by surfacing one practical next action rather than overwhelming you with the entire system.",
      target: "[data-tour='today-next-action']",
      placement: "bottom",
      allowInteraction: true,
    },

    {
      id: "focus",
      title: "Keep real-life commitments visible",
      description:
        "Today’s Focus holds responsibilities outside deliberate practice, so your plan reflects your actual life.",
      target: "[data-tour='today-focus']",
      placement: "top",
      allowInteraction: true,
    },

    {
      id: "learning",
      title: "Forge learns from evidence",
      description:
        "As you practice and reflect, Forge begins identifying recurring themes, momentum, and changes in your developing identity.",
      target: "[data-tour='today-learning']",
      placement: "top",
    },

    {
      id: "reflection",
      title: "Close the learning loop",
      description:
        "Reflection gives context to completed work. It helps Forge understand not only what happened, but what the experience meant.",
      target: "[data-tour='today-reflection']",
      placement: "top",
      allowInteraction: true,
    },

    {
      id: "momentum",
      title: "Read your current state",
      description:
        "Momentum combines consistency, recovery, adherence, and burnout risk into a practical picture of how your practice is going.",
      target: "[data-tour='today-momentum']",
      placement: "left",
    },

    {
      id: "progress",
      title: "Small actions become visible progress",
      description:
        "Your daily and weekly completion data show whether your intentions are becoming consistent evidence.",
      target: "[data-tour='today-progress']",
      placement: "left",
    },

    {
      id: "complete",
      title: "Your Forge is lit",
      description:
        "You now have a living practice system. Use Today to act, reflect, and let the system become more useful as evidence accumulates.",
      placement: "center",
    },
  ],
};