import { getForecast } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

function errorResponse(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}

function parseCoord(value: string | null): number | null {
  if (value == null) return null;
  const n = parseFloat(value);
  return Number.isNaN(n) ? null : n;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseCoord(searchParams.get("lat"));
  const lon = parseCoord(searchParams.get("lon"));
  const tz = searchParams.get("tz") ?? undefined;

  if (lat == null || lon == null) {
    return errorResponse("lat and lon are required", 400);
  }

  try {
    const data = await getForecast(lat, lon, tz);
    return jsonResponse(data);
  } catch (err) {
    console.error("[api/forecast]", err);
    const message = err instanceof Error ? err.message : "Forecast failed";
    return errorResponse(message, 500);
  }
}
