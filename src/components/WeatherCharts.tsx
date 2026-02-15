"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import type { ForecastResponse } from "@/types/weather";
import { formatTime, formatDate } from "@/lib/format";
import { CHART_MARGIN, TOOLTIP_CONTENT_STYLE } from "@/lib/chart-styles";
import { TEMPERATURE_CHART_HOURS } from "@/constants";

interface ChartProps {
  data: ForecastResponse;
}

export function TemperatureChart({ data }: ChartProps) {
  const hourly = data.hourly;
  if (!hourly?.time?.length || !hourly.temperature_2m) return null;

  const chartData = hourly.time.slice(0, TEMPERATURE_CHART_HOURS).map((time, i) => ({
    time: formatTime(time),
    full: time,
    temp: hourly.temperature_2m[i],
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={CHART_MARGIN}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "var(--muted)" }} />
          <YAxis
            domain={["dataMin - 2", "dataMax + 2"]}
            tick={{ fill: "var(--muted)" }}
            tickFormatter={(v) => `${v}°`}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            labelStyle={{ color: "var(--text)" }}
            formatter={(value: number) => [`${value}°C`, "Temp"]}
            labelFormatter={(_, payload) =>
              payload[0]?.payload?.full
                ? formatTime(payload[0].payload.full)
                : ""
            }
          />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#tempGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PrecipitationChart({ data }: ChartProps) {
  const daily = data.daily;
  if (!daily?.time?.length || !daily.precipitation_sum) return null;

  const chartData = daily.time.map((time, i) => ({
    date: formatDate(time),
    rain: daily.precipitation_sum[i] ?? 0,
    prob: daily.precipitation_probability_max?.[i] ?? 0,
  }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "var(--muted)" }} />
          <YAxis
            tick={{ fill: "var(--muted)" }}
            tickFormatter={(v) => `${v} mm`}
          />
          <Tooltip
            contentStyle={TOOLTIP_CONTENT_STYLE}
            formatter={(value: number, name: string) => [
              name === "rain" ? `${value} mm` : `${value}%`,
              name === "rain" ? "Precipitation" : "Chance",
            ]}
          />
          <Bar dataKey="rain" fill="var(--chart-3)" radius={[4, 4, 0, 0]} name="rain" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
