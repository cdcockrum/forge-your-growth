export const forge = {
  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
  },

  spacing: {
    xs: "p-2",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
    xl: "p-8",
  },

  shadow: {
    card: "shadow-sm",
    floating: "shadow-lg",
  },

  animation: {
    default: "transition-all duration-200",
    fast: "transition-all duration-150",
  },

  typography: {
    eyebrow:
      "font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground",

    heading:
      "text-xl font-extrabold tracking-tight",

    body:
      "text-sm leading-6 text-muted-foreground",

    stat:
      "text-4xl font-extrabold tracking-tight",
  },
} as const;