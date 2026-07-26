import type {
  TourDefinition,
} from "@/features/tour/tour.store";

export const visionTour: TourDefinition = {
  id: "vision",

  name: "Forge Vision",

  nextTourId: "areas",

  nextRoute: "/areas",

  steps: [
    {
      id: "welcome",

      title: "Welcome to Forge",

      description:
        "Forge begins with identity rather than productivity. Before planning your weeks, let's define who you want to become.",

      placement: "center",
    },

    {
      id: "mission",

      title: "Your Mission",

      description:
        "This is the broad direction of your life. Think in decades rather than projects.",

      target: "[data-tour='mission']",

      placement: "bottom",
    },

    {
      id: "north-star",

      title: "Your North Star",

      description:
        "This sentence becomes your compass. When Forge recommends between two good choices, this wins.",

      target: "[data-tour='north-star']",

      placement: "bottom",
    },

    {
      id: "values",

      title: "Core Values",

      description:
        "Values determine how you pursue your goals. Skills can change. Values should endure.",

      target: "[data-tour='values']",

      placement: "top",
    },

    {
      id: "save",

      title: "Ready?",

      description:
        "Save your Vision and we'll begin building the foundation of your growth system.",

      target: "[data-tour='vision-save']",

      placement: "left",
    },
  ],
};