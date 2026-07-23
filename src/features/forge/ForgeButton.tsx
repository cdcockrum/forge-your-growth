import type {
  ButtonHTMLAttributes,
} from "react";

export function ForgeButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center",
        "rounded-xl",
        "bg-foreground",
        "px-5 py-3",
        "font-medium",
        "text-background",
        "transition",
        "hover:opacity-90",
        props.className,
      ].join(" ")}
    />
  );
}