import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  TrendPoint,
} from "../view-models";

type ForgeLineChartProps = {
  title: string;
  description?: string;
  data: TrendPoint[];
  valueLabel: string;
  valueSuffix?: string;
  emptyMessage?: string;
};

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

export function ForgeLineChart({
  title,
  description,
  data,
  valueLabel,
  valueSuffix = "",
  emptyMessage = "Not enough historical data yet.",
}: ForgeLineChartProps) {
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
            <LineChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                bottom: 0,
                left: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
              />

              <Tooltip
                labelFormatter={(value) =>
                  formatDate(String(value))
                }
                formatter={(value) => [
                  `${Number(value)}${valueSuffix}`,
                  valueLabel,
                ]}
                contentStyle={{
                  borderRadius: "12px",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                name={valueLabel}
                stroke="currentColor"
                strokeWidth={2.5}
                dot={{
                  r: 3,
                }}
                activeDot={{
                  r: 5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}