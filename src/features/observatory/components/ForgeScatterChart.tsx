import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  ScatterPoint,
} from "../view-models";

type ForgeScatterChartProps = {
  title: string;
  description?: string;
  data: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  emptyMessage?: string;
};

function formatEnergy(value: number): string {
  if (value === 1) {
    return "Low";
  }

  if (value === 2) {
    return "Medium";
  }

  if (value === 3) {
    return "High";
  }

  return String(value);
}

export function ForgeScatterChart({
  title,
  description,
  data,
  xLabel,
  yLabel,
  emptyMessage = "Not enough reflection history yet.",
}: ForgeScatterChartProps) {
  return (
    <section className="rounded-2xl border bg-card p-5 sm:p-6">
      <header>
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>

      {data.length === 0 ? (
        <div className="mt-6 flex min-h-64 items-center justify-center rounded-xl bg-muted/30 px-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <ScatterChart
              margin={{
                top: 8,
                right: 12,
                bottom: 12,
                left: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                type="number"
                dataKey="x"
                name={xLabel}
                domain={[1, 3]}
                ticks={[1, 2, 3]}
                tickFormatter={formatEnergy}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                type="number"
                dataKey="y"
                name={yLabel}
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={36}
              />

              <Tooltip
                cursor={{
                  strokeDasharray: "3 3",
                }}
                formatter={(value, name) => {
                  if (name === xLabel) {
                    return [
                      formatEnergy(
                        Number(value),
                      ),
                      xLabel,
                    ];
                  }

                  return [
                    Number(value),
                    yLabel,
                  ];
                }}
                contentStyle={{
                  borderRadius: "12px",
                }}
              />

              <Scatter
                data={data}
                fill="currentColor"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}