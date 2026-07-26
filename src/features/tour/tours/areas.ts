import type {
  TourDefinition,
} from "@/features/tour/tour.store";

export const areasTour: TourDefinition = {
  id: "areas",
  name: "Life Areas",

  steps: [
    {
      id: "overview",
      title: "Define the major parts of your life",
      description:
        "Life Areas are broad domains such as Creativity, Health, Career, Relationships, Languages, or Spirituality. Skills will live inside them.",
      target: "[data-tour='areas-title']",
      placement: "bottom",
    },

    {
      id: "new-area",
      title: "Create your first Area",
      description:
        "Begin with one meaningful area. You can add more later, but you do not need to map your entire life at once.",
      target: "[data-tour='areas-new'], [data-tour='areas-empty-create']",
      placement: "bottom",
      allowInteraction: true,
    },

    {
      id: "area-name",
      title: "Name the domain",
      description:
        "Use a broad name such as Creativity, Health, Career, Languages, or Spirituality.",
      target: "[data-tour='area-name']",
      placement: "bottom",
      allowInteraction: true,
      waitForTarget: true,
    },

    {
      id: "area-vision",
      title: "Describe what growth means here",
      description:
        "Write a brief picture of who you hope to become in this area. Forge can use this context in planning and future recommendations.",
      target: "[data-tour='area-vision']",
      placement: "bottom",
      allowInteraction: true,
      waitForTarget: true,
    },

    {
      id: "area-settings",
      title: "Give it structure",
      description:
        "Color makes the Area easy to recognize. Priority helps Forge understand its relative importance.",
      target: "[data-tour='area-color']",
      placement: "top",
      allowInteraction: true,
      waitForTarget: true,
    },

    {
      id: "create-area",
      title: "Add the Area",
      description:
        "Create the Area when you are ready. It will become the container for related skills and practice sessions.",
      target: "[data-tour='area-create']",
      placement: "left",
      allowInteraction: true,
      waitForTarget: true,
    },

    {
      id: "continue",
      title: "Move from areas to skills",
      description:
        "Once you have at least one Area, continue to Skills. That is where broad intentions become specific abilities you can practice.",
      target: "[data-tour='areas-continue']",
      placement: "top",
      allowInteraction: true,
    },
  ],
};