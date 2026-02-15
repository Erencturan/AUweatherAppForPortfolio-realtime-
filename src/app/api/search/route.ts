import { searchCities } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

function errorResponse(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q?.trim()) {
    return jsonResponse({ results: [] });
  }

  try {
    const results = await searchCities(q);
    return jsonResponse({ results });
  } catch (err) {
    console.error("[api/search]", err);
    return errorResponse("Search failed", 500);
  }
}
