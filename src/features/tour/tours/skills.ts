import type {
  TourDefinition,
} from "@/features/tour/tour.store";

export const skillsTour: TourDefinition = {
  id: "skills",

  name: "Skills",

  steps: [
    {
      id: "overview",
      title: "Choose repeatable abilities",
      description:
        "Life Areas become Skills. Skills become deliberate Practice Sessions.",
      target: "[data-tour='skills-title']",
      placement: "bottom",
    },

    {
      id: "new",
      title: "Create a Skill",
      description:
        "Choose one concrete ability you can deliberately practice and improve over time.",
      target:
        "[data-tour='skills-new'], [data-tour='skills-empty-create']",
      placement: "bottom",
      allowInteraction: true,
    },

    {
      id: "name",
      title: "Give the Skill a clear name",
      description:
        "Examples include French, Piano, Deep Writing, Strength Training, Painting, or Meditation.",
      target: "[data-tour='skill-name']",
      placement: "bottom",
      waitForTarget: true,
      allowInteraction: true,
    },

    {
      id: "area",
      title: "Connect it to a Life Area",
      description:
        "Every Skill belongs within one of the broad Life Areas you created previously.",
      target: "[data-tour='skill-area']",
      placement: "bottom",
      waitForTarget: true,
      allowInteraction: true,
    },

    {
      id: "frequency",
      title: "Choose a weekly rhythm",
      description:
        "Set how many times each week you would ideally practice this Skill.",
      target: "[data-tour='skill-frequency']",
      placement: "bottom",
      waitForTarget: true,
      allowInteraction: true,
    },

    {
      id: "minutes",
      title: "Set a useful session length",
      description:
        "Choose a duration that is meaningful but sustainable within your real schedule.",
      target: "[data-tour='skill-minutes']",
      placement: "bottom",
      waitForTarget: true,
      allowInteraction: true,
    },

    {
      id: "difficulty",
      title: "Estimate the difficulty",
      description:
        "Difficulty helps Forge understand the effort and recovery this practice may require.",
      target: "[data-tour='skill-difficulty']",
      placement: "bottom",
      waitForTarget: true,
      allowInteraction: true,
    },

    {
      id: "days",
      title: "Choose preferred days",
      description:
        "Forge uses these days to build your initial plan. Your schedule can adapt later as evidence accumulates.",
      target: "[data-tour='skill-days']",
      placement: "top",
      waitForTarget: true,
      allowInteraction: true,
    },

    {
      id: "create",
      title: "Create the Skill",
      description:
        "Once created, Forge can turn this Skill into scheduled practice sessions.",
      target: "[data-tour='skill-create']",
      placement: "left",
      waitForTarget: true,
      allowInteraction: true,
    },

    {
      id: "continue",
      title: "Forge your first week",
      description:
        "You now have enough structure for Forge to generate your first deliberate practice week.",
      target: "[data-tour='skills-continue']",
      placement: "top",
      allowInteraction: true,
    },
  ],
};