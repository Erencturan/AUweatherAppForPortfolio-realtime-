// Australian cities for quick filter (lat/lon for Open-Meteo)
export const AUSTRALIAN_CITIES = [
  { id: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093, state: "NSW" },
  { id: "melbourne", name: "Melbourne", lat: -37.8136, lon: 144.9631, state: "VIC" },
  { id: "brisbane", name: "Brisbane", lat: -27.4698, lon: 153.0251, state: "QLD" },
  { id: "perth", name: "Perth", lat: -31.9505, lon: 115.8605, state: "WA" },
  { id: "adelaide", name: "Adelaide", lat: -34.9285, lon: 138.6007, state: "SA" },
  { id: "gold-coast", name: "Gold Coast", lat: -28.0167, lon: 153.4000, state: "QLD" },
  { id: "newcastle", name: "Newcastle", lat: -32.9283, lon: 151.7817, state: "NSW" },
  { id: "canberra", name: "Canberra", lat: -35.2809, lon: 149.1300, state: "ACT" },
  { id: "hobart", name: "Hobart", lat: -42.8821, lon: 147.3272, state: "TAS" },
  { id: "darwin", name: "Darwin", lat: -12.4634, lon: 130.8456, state: "NT" },
] as const;

export type CityId = (typeof AUSTRALIAN_CITIES)[number]["id"];
