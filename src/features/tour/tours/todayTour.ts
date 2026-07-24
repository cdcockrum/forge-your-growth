import type {
  TourDefinition,
} from "../types";

export const todayTour:
  TourDefinition = {
  id: "today",

  name: "Today Tour",

  steps: [
    {
      id: "hero",
      target:
        "#today-hero",
      title:
        "Welcome to your Forge",
      description:
        "Every day begins here. You do not need to carry the entire week at once. Begin by noticing where you are and what deserves your attention.",
      placement:
        "bottom-right",
    },

    {
      id: "mission",
      target:
        "#mission-card",
      title:
        "Take the next meaningful step",
      description:
        "Forge is not about doing everything. It helps you identify one deliberate practice that moves your future forward.",
      placement:
        "top-right",
    },

    {
      id: "focus",
      target:
        "#focus-list",
      title:
        "Protect what matters",
      description:
        "Not everything important is a practice session. Focus holds the responsibilities and commitments that support the life you are building.",
      placement:
        "top-right",
    },

    {
      id: "reflection",
      target:
        "#reflection",
      title:
        "Turn effort into wisdom",
      description:
        "Reflection closes the loop. A few honest sentences help Forge understand what worked, what resisted you, and what tomorrow may require.",
      placement:
        "top-right",
    },

    {
      id: "momentum",
      target:
        "#momentum",
      title:
        "Consistency, not perfection",
      description:
        "Momentum shows whether your current rhythm is sustainable. One missed day matters far less than returning to the work.",
      placement:
        "bottom-left",
    },

    {
      id: "complete",
      title:
        "You’re ready.",
      description:
        "Forge will not ask you to become someone else. It will help you become the person you have already chosen to be—one deliberate action at a time.",
      placement:
        "center",
      completion: true,
    },
  ],
};