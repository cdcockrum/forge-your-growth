import {
  Children,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  FadeIn,
} from "./FadeIn";

type StaggerProps = {
  children: ReactNode;

  delay?: number;

  step?: number;

  className?: string;

  itemClassName?: string;
};

export function Stagger({
  children,
  delay = 0,
  step = 70,
  className = "",
  itemClassName = "",
}: StaggerProps) {
  const items =
    Children.toArray(
      children,
    );

  return (
    <div className={className}>
      {items.map(
        (child, index) => (
          <FadeIn
            key={index}
            delay={
              delay +
              index * step
            }
            className={
              itemClassName
            }
          >
            {child}
          </FadeIn>
        ),
      )}
    </div>
  );
}