"use client";

import { useCallback, useState } from "react";
import type { ForecastResponse } from "@/types/weather";

export type ForecastStatus = "idle" | "loading" | "success" | "error";

interface ForecastState {
  data: ForecastResponse | null;
  status: ForecastStatus;
  error: string | null;
}

const INITIAL_STATE: ForecastState = {
  data: null,
  status: "idle",
  error: null,
};

function buildForecastUrl(lat: number, lon: number, tz?: string): string {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
  });
  if (tz) params.set("tz", tz);
  return `/api/forecast?${params.toString()}`;
}

export function useForecast() {
  const [state, setState] = useState<ForecastState>(INITIAL_STATE);

  const fetchForecast = useCallback(async (lat: number, lon: number, tz?: string) => {
    setState((prev) => ({ ...prev, status: "loading", error: null }));

    try {
      const res = await fetch(buildForecastUrl(lat, lon, tz));
      const data = await res.json();

      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to load forecast");
      }

      setState({ data: data as ForecastResponse, status: "success", error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setState((prev) => ({ ...prev, status: "error", error: message }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    forecast: state.data,
    status: state.status,
    error: state.error,
    fetchForecast,
    reset,
    isPending: state.status === "idle" || state.status === "loading",
  } as const;
}
