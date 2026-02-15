"use client";

import { useCallback, useEffect, useState } from "react";
import { WeatherSearch } from "@/components/WeatherSearch";
import { CityFilter } from "@/components/CityFilter";
import { CurrentWeather } from "@/components/CurrentWeather";
import { TemperatureChart, PrecipitationChart } from "@/components/WeatherCharts";
import { ChartSection } from "@/components/ChartSection";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { useForecast } from "@/hooks";
import { AUSTRALIAN_CITIES, type CityId } from "@/lib/cities";
import { DEFAULT_CITY_ID } from "@/constants";
import type { GeocodingResult } from "@/types/weather";

const defaultCity = AUSTRALIAN_CITIES.find((c) => c.id === DEFAULT_CITY_ID)!;

export default function Home() {
  const { forecast, status, error, fetchForecast, isPending } = useForecast();
  const [cityName, setCityName] = useState<string>(defaultCity.name);
  const [selectedCityId, setSelectedCityId] = useState<CityId | null>(DEFAULT_CITY_ID);

  const handleSearchSelect = useCallback(
    (result: GeocodingResult) => {
      setCityName(result.name);
      setSelectedCityId(null);
      fetchForecast(result.latitude, result.longitude, result.timezone);
    },
    [fetchForecast]
  );

  const handleCityFilter = useCallback(
    (id: CityId, lat: number, lon: number) => {
      const city = AUSTRALIAN_CITIES.find((c) => c.id === id);
      setCityName(city?.name ?? id);
      setSelectedCityId(id);
      fetchForecast(lat, lon, "auto");
    },
    [fetchForecast]
  );

  const handleRetry = useCallback(() => {
    const city = AUSTRALIAN_CITIES.find((c) => c.id === selectedCityId);
    if (city) {
      fetchForecast(city.lat, city.lon);
    } else if (forecast) {
      fetchForecast(forecast.latitude, forecast.longitude, forecast.timezone);
    }
  }, [selectedCityId, forecast, fetchForecast]);

  useEffect(() => {
    fetchForecast(defaultCity.lat, defaultCity.lon);
  }, [fetchForecast]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header>
          <h1 className="text-3xl font-bold text-[var(--text)]">
            Australia Weather
          </h1>
          <p className="mt-1 text-[var(--muted)]">
            Real-time forecast. Search or pick a city below.
          </p>
        </header>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
          <WeatherSearch onSelect={handleSearchSelect} />
        </div>

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-[var(--muted)]">
            Quick select
          </p>
          <CityFilter selectedId={selectedCityId} onSelect={handleCityFilter} />
        </div>

        <div className="mt-8 space-y-6">
          {isPending && <LoadingState message="Loading weather…" />}

          {status === "error" && (
            <ErrorState message={error ?? "Something went wrong"} onRetry={handleRetry} />
          )}

          {status === "success" && forecast && (
            <>
              <CurrentWeather data={forecast} cityName={cityName} />
              <ChartSection title="Hourly temperature (48h)">
                <TemperatureChart data={forecast} />
              </ChartSection>
              <ChartSection title="Daily precipitation (7 days)">
                <PrecipitationChart data={forecast} />
              </ChartSection>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
