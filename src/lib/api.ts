import type { GeocodingResult } from "@/types/weather";
import type { ForecastResponse, WeatherApiError } from "@/types/weather";
import {
  FORECAST_REVALIDATE_SECONDS,
  GEOCODING_REVALIDATE_SECONDS,
  COUNTRY_CODE_AU,
} from "@/constants";

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

const FORECAST_CURRENT_FIELDS =
  "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m";
const FORECAST_HOURLY_FIELDS =
  "temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code";
const FORECAST_DAILY_FIELDS =
  "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,sunrise,sunset";

function isWeatherApiError(data: unknown): data is WeatherApiError {
  return (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    (data as WeatherApiError).error === true
  );
}

interface GeocodingApiResponse {
  results?: GeocodingResult[];
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const params = new URLSearchParams({
    name: trimmed,
    count: "15",
    language: "en",
    format: "json",
  });

  const res = await fetch(`${GEOCODING_BASE}?${params}`, {
    next: { revalidate: GEOCODING_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error("Geocoding request failed");
  }

  const data = (await res.json()) as GeocodingApiResponse;
  const results = data.results ?? [];
  return results.filter((r) => r.country_code === COUNTRY_CODE_AU);
}

export async function getForecast(
  latitude: number,
  longitude: number,
  timezone = "auto"
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    timezone,
    current: FORECAST_CURRENT_FIELDS,
    hourly: FORECAST_HOURLY_FIELDS,
    daily: FORECAST_DAILY_FIELDS,
    forecast_days: "7",
  });

  const res = await fetch(`${FORECAST_BASE}?${params}`, {
    next: { revalidate: FORECAST_REVALIDATE_SECONDS },
  });

  const data: unknown = await res.json();

  if (isWeatherApiError(data)) {
    throw new Error(data.reason ?? "Forecast request failed");
  }

  return data as ForecastResponse;
}
