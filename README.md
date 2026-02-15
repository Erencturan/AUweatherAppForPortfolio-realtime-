# Australia Weather — Fullstack Portfolio App

A **Next.js 15 + TypeScript** fullstack app that shows **real-time weather for Australian cities**, with search, city filters, loading/error states, server-side caching, and charts. Built for portfolio use.

## Features

- **Search** — Debounced city search (Australian cities only) via Open-Meteo Geocoding API
- **Filters** — Quick-select buttons for 10 major Australian cities (Sydney, Melbourne, Brisbane, Perth, Adelaide, Gold Coast, Newcastle, Canberra, Hobart, Darwin)
- **API loading states** — Loading spinners and disabled states while fetching
- **Error handling** — Error messages and “Try again” for failed requests
- **Caching** — Next.js `revalidate` on API routes (10 min forecast, 1 h search)
- **Charts** — Hourly temperature (48h) and daily precipitation (7 days) with Recharts

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Open-Meteo API** (weather + geocoding, no API key)
- **Recharts** (temperature and precipitation charts)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    api/
      search/   # GET ?q= — city search (AU only)
      forecast/ # GET ?lat=&lon= — weather forecast
    layout.tsx
    page.tsx    # Main dashboard
  components/
    WeatherSearch.tsx   # Search + dropdown
    CityFilter.tsx      # City quick-select
    CurrentWeather.tsx  # Current conditions
    WeatherCharts.tsx   # Temperature & precipitation charts
    LoadingState.tsx
    ErrorState.tsx
  lib/
    api.ts    # Open-Meteo fetch + cache
    cities.ts # AU city list (lat/lon)
  types/
    weather.ts # API types + WMO codes
```

## API & Caching

- **Geocoding:** `https://geocoding-api.open-meteo.com/v1/search` — results filtered to `country_code === "AU"`.
- **Forecast:** `https://api.open-meteo.com/v1/forecast` — current, hourly, and daily data.
- Caching: `revalidate: 600` (forecast), `revalidate: 3600` (search) in `src/lib/api.ts`.

## Portfolio Highlights

- **Async logic** — Fetch in API routes and client, with loading/error/empty states.
- **API consumption** — Typed requests/responses and error handling.
- **UI states** — Idle, loading, success, error; search debouncing and dropdown.
- **Fullstack** — Next.js API routes as a thin layer over Open-Meteo with caching.

## License

MIT.
