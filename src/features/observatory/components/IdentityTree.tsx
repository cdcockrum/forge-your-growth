import {
  useMemo,
  useState,
} from "react";

import type {
  IdentityTreeBranch,
  IdentityTreeViewModel,
} from "../identity-tree";

type IdentityTreeProps = {
  model: IdentityTreeViewModel;
};

type Point = {
  x: number;
  y: number;
};

function branchEndPoint(
  index: number,
  total: number,
): Point {
  const centerX = 400;

  if (total <= 1) {
    return {
      x: centerX,
      y: 180,
    };
  }

  const spread = 560;
  const startX =
    centerX - spread / 2;

  const step =
    spread / (total - 1);

  return {
    x: startX + index * step,
    y:
      index % 2 === 0
        ? 190
        : 150,
  };
}

function branchPath({
  start,
  end,
}: {
  start: Point;
  end: Point;
}): string {
  const controlY =
    start.y -
    (start.y - end.y) * 0.55;

  return [
    `M ${start.x} ${start.y}`,
    `C ${start.x} ${controlY}`,
    `${end.x} ${controlY}`,
    `${end.x} ${end.y}`,
  ].join(" ");
}

function leafPosition({
  branch,
  index,
  total,
}: {
  branch: IdentityTreeBranch;
  index: number;
  total: number;
}): Point {
  const radius = Math.max(
    48,
    Math.min(
      78,
      44 + branch.strength * 3,
    ),
  );

  const angle =
    total <= 1
      ? -Math.PI / 2
      : -Math.PI +
        (Math.PI * index) /
          Math.max(1, total - 1);

  return {
    x:
      Math.cos(angle) *
      radius,

    y:
      Math.sin(angle) *
      radius,
  };
}

function formatTraitLabel(
  value: string,
): string {
  return value
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function getBranchSummary(
  branch: IdentityTreeBranch,
): string {
  if (
    branch.strongestSkill &&
    branch.skills.length > 1
  ) {
    return `${branch.strongestSkill} provides the strongest evidence, supported by ${branch.skills.length - 1} additional skills.`;
  }

  if (branch.strongestSkill) {
    return `${branch.strongestSkill} currently provides the strongest evidence for this trait.`;
  }

  return `${branch.evidence} completed practices currently support this trait.`;
}

export function IdentityTree({
  model,
}: IdentityTreeProps) {
  const initialTrait =
    model.dominantTrait ??
    model.branches[0]?.trait ??
    null;

  const [
    selectedTrait,
    setSelectedTrait,
  ] = useState(initialTrait);

  const selectedBranch =
    useMemo(
      () =>
        model.branches.find(
          (branch) =>
            branch.trait ===
            selectedTrait,
        ) ??
        model.branches[0] ??
        null,
      [
        model.branches,
        selectedTrait,
      ],
    );

  const trunkStart: Point = {
    x: 400,
    y: 620,
  };

  const branchStart: Point = {
    x: 400,
    y: 470,
  };

  if (model.branches.length === 0) {
    return (
      <section className="rounded-2xl border bg-card p-5 sm:p-6">
        <header>
          <h2 className="text-lg font-semibold">
            {model.title}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {model.subtitle}
          </p>
        </header>

        <div className="mt-6 flex min-h-80 items-center justify-center rounded-xl bg-muted/30 px-6 text-center">
          <div>
            <p className="font-medium">
              Your identity tree is
              still taking root.
            </p>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Complete practices
              connected to your skills
              and Forge will begin
              growing trait branches
              from that evidence.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {model.title}
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {model.subtitle}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Select a trait branch to
            inspect its supporting
            evidence.
          </p>
        </div>

        <div className="rounded-xl bg-muted px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Dominant trait
          </p>

          <p className="mt-1 font-semibold">
            {model.dominantTrait
              ? formatTraitLabel(
                  model.dominantTrait,
                )
              : "Still emerging"}
          </p>
        </div>
      </header>

      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[760px]">
          <svg
            viewBox="0 0 800 680"
            role="img"
            aria-label="Identity tree showing selectable trait branches and supporting skills"
            className="h-auto w-full"
          >
            <defs>
              <linearGradient
                id="forge-tree-trunk"
                x1="0"
                y1="1"
                x2="0"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="currentColor"
                  stopOpacity="0.35"
                />

                <stop
                  offset="100%"
                  stopColor="currentColor"
                  stopOpacity="0.8"
                />
              </linearGradient>

              <filter
                id="forge-tree-shadow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="8"
                  floodOpacity="0.14"
                />
              </filter>

              <filter
                id="forge-tree-selected-shadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="7"
                  stdDeviation="11"
                  floodOpacity="0.24"
                />
              </filter>
            </defs>

            <path
              d={[
                `M ${trunkStart.x} ${trunkStart.y}`,
                "C 370 570",
                "380 515",
                `${branchStart.x} ${branchStart.y}`,
              ].join(" ")}
              fill="none"
              stroke="url(#forge-tree-trunk)"
              strokeWidth="34"
              strokeLinecap="round"
            />

            <ellipse
              cx="400"
              cy="630"
              rx="82"
              ry="18"
              className="fill-muted"
            />

            <circle
              cx="400"
              cy="620"
              r="48"
              className="fill-background stroke-border"
              strokeWidth="2"
              filter="url(#forge-tree-shadow)"
            />

            <text
              x="400"
              y="615"
              textAnchor="middle"
              className="fill-foreground text-[18px] font-semibold"
            >
              You
            </text>

            <text
              x="400"
              y="640"
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {model.totalScore.toFixed(1)}{" "}
              trait evidence
            </text>

            {model.branches.map(
              (branch, index) => {
                const end =
                  branchEndPoint(
                    index,
                    model.branches.length,
                  );

                const isSelected =
                  selectedBranch?.trait ===
                  branch.trait;

                const strokeWidth =
                  Math.max(
                    5,
                    Math.min(
                      18,
                      4 + branch.strength,
                    ),
                  );

                const branchRadius =
                  34 +
                  branch.strength * 2;

                return (
                  <g
                    key={branch.trait}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${branch.label} trait`}
                    aria-pressed={
                      isSelected
                    }
                    onClick={() =>
                      setSelectedTrait(
                        branch.trait,
                      )
                    }
                    onKeyDown={(
                      event,
                    ) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();

                        setSelectedTrait(
                          branch.trait,
                        );
                      }
                    }}
                    className={[
                      "cursor-pointer outline-none transition-opacity",
                      isSelected
                        ? "text-foreground"
                        : "text-foreground opacity-60 hover:opacity-90 focus:opacity-90",
                    ].join(" ")}
                  >
                    <path
                      d={branchPath({
                        start:
                          branchStart,
                        end,
                      })}
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity={
                        isSelected
                          ? 0.95
                          : 0.35 +
                            Math.min(
                              0.45,
                              branch.strength /
                                20,
                            )
                      }
                      strokeWidth={
                        isSelected
                          ? strokeWidth +
                            2
                          : strokeWidth
                      }
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />

                    <circle
                      cx={end.x}
                      cy={end.y}
                      r={
                        isSelected
                          ? branchRadius +
                            4
                          : branchRadius
                      }
                      className={[
                        "transition-all duration-300",
                        isSelected
                          ? "fill-foreground stroke-foreground"
                          : "fill-background stroke-border",
                      ].join(" ")}
                      strokeWidth={
                        isSelected
                          ? 3
                          : 2
                      }
                      filter={
                        isSelected
                          ? "url(#forge-tree-selected-shadow)"
                          : "url(#forge-tree-shadow)"
                      }
                    />

                    <text
                      x={end.x}
                      y={end.y - 4}
                      textAnchor="middle"
                      className={[
                        "pointer-events-none text-[13px] font-semibold",
                        isSelected
                          ? "fill-background"
                          : "fill-foreground",
                      ].join(" ")}
                    >
                      {branch.label}
                    </text>

                    <text
                      x={end.x}
                      y={end.y + 15}
                      textAnchor="middle"
                      className={[
                        "pointer-events-none text-[10px]",
                        isSelected
                          ? "fill-background opacity-80"
                          : "fill-muted-foreground",
                      ].join(" ")}
                    >
                      {branch.score.toFixed(
                        1,
                      )}{" "}
                      · {branch.evidence}{" "}
                      sessions
                    </text>

                    {branch.skills.map(
                      (
                        skill,
                        skillIndex,
                      ) => {
                        const offset =
                          leafPosition({
                            branch,
                            index:
                              skillIndex,
                            total:
                              branch.skills
                                .length,
                          });

                        const leafX =
                          end.x +
                          offset.x;

                        const leafY =
                          end.y +
                          offset.y;

                        return (
                          <g
                            key={`${branch.trait}:${skill.id}`}
                            className="pointer-events-none"
                          >
                            <line
                              x1={end.x}
                              y1={end.y}
                              x2={leafX}
                              y2={leafY}
                              stroke="currentColor"
                              strokeOpacity={
                                isSelected
                                  ? 0.5
                                  : 0.2
                              }
                              strokeWidth={
                                isSelected
                                  ? 2.5
                                  : 2
                              }
                            />

                            <circle
                              cx={leafX}
                              cy={leafY}
                              r={
                                isSelected
                                  ? 18
                                  : 16
                              }
                              className={[
                                "transition-all duration-300",
                                isSelected
                                  ? "fill-foreground stroke-foreground"
                                  : "fill-muted stroke-border",
                              ].join(" ")}
                              strokeWidth="1.5"
                            />

                            <text
                              x={leafX}
                              y={leafY + 31}
                              textAnchor="middle"
                              className="fill-muted-foreground text-[9px]"
                            >
                              {skill.name}
                            </text>
                          </g>
                        );
                      },
                    )}
                  </g>
                );
              },
            )}
          </svg>
        </div>
      </div>

      {selectedBranch ? (
        <div
          aria-live="polite"
          className="mt-6 rounded-2xl border bg-background p-5 sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Selected trait
              </p>

              <h3 className="mt-1 text-2xl font-semibold">
                {selectedBranch.label}
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {getBranchSummary(
                  selectedBranch,
                )}
              </p>
            </div>

            <div className="rounded-xl bg-muted px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Branch strength
              </p>

              <p className="mt-1 text-xl font-semibold">
                {
                  selectedBranch.strength
                }
                /10
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Trait score
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {selectedBranch.score.toFixed(
                  1,
                )}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Evidence
              </p>

              <p className="mt-2 text-2xl font-semibold">
                {
                  selectedBranch.evidence
                }
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                completed sessions
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Strongest skill
              </p>

              <p className="mt-2 text-lg font-semibold">
                {selectedBranch.strongestSkill ??
                  "Still emerging"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium">
              Supporting skills
            </p>

            {selectedBranch.skills
              .length > 0 ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {selectedBranch.skills.map(
                  (skill) => (
                    <div
                      key={skill.id}
                      className="rounded-xl border p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">
                          {skill.name}
                        </p>

                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                          {skill.score.toFixed(
                            1,
                          )}
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-foreground transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                8,
                                (skill.score /
                                  Math.max(
                                    selectedBranch.score,
                                    1,
                                  )) *
                                  100,
                              ),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Supporting skills
                will appear as more
                evidence is recorded.
              </p>
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {model.branches
          .slice(0, 4)
          .map((branch) => {
            const isSelected =
              selectedBranch?.trait ===
              branch.trait;

            return (
              <button
                key={branch.trait}
                type="button"
                aria-pressed={
                  isSelected
                }
                onClick={() =>
                  setSelectedTrait(
                    branch.trait,
                  )
                }
                className={[
                  "rounded-xl border p-4 text-left transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "bg-background hover:bg-muted/50",
                ].join(" ")}
              >
                <p className="font-medium">
                  {branch.label}
                </p>

                <p
                  className={[
                    "mt-1 text-sm",
                    isSelected
                      ? "text-background/75"
                      : "text-muted-foreground",
                  ].join(" ")}
                >
                  {branch.strongestSkill
                    ? `Most supported by ${branch.strongestSkill}.`
                    : `${branch.evidence} supporting practices.`}
                </p>
              </button>
            );
          })}
      </div>
    </section>
  );
}