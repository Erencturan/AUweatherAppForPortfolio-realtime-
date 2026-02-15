"use client";

import { getWeatherLabel } from "@/types/weather";
import type { ForecastResponse } from "@/types/weather";

interface CurrentWeatherProps {
  data: ForecastResponse;
  cityName: string;
}

export function CurrentWeather({ data, cityName }: CurrentWeatherProps) {
  const current = data.current;
  if (!current) return null;

  const weatherLabel = getWeatherLabel(current.weather_code);

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="text-lg font-semibold text-[var(--muted)]">{cityName}</h2>
      <div className="mt-2 flex flex-wrap items-baseline gap-4">
        <span className="text-5xl font-bold text-[var(--text)] tabular-nums">
          {Math.round(current.temperature_2m)}°C
        </span>
        <span className="text-xl text-[var(--muted)]">
          Feels like {Math.round(current.apparent_temperature)}°C
        </span>
      </div>
      <p className="mt-1 text-[var(--muted)]">{weatherLabel}</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-[var(--muted)]">Humidity</dt>
          <dd className="font-medium">{current.relative_humidity_2m}%</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Wind</dt>
          <dd className="font-medium">{current.wind_speed_10m} km/h</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Pressure</dt>
          <dd className="font-medium">{Math.round(current.pressure_msl)} hPa</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Precipitation</dt>
          <dd className="font-medium">{current.precipitation} mm</dd>
        </div>
      </dl>
    </section>
  );
}
