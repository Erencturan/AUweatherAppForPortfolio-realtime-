/** Default city shown on first load */
export const DEFAULT_CITY_ID = "sydney" as const;

/** Debounce delay for search input (ms) */
export const SEARCH_DEBOUNCE_MS = 300;

/** Min query length before triggering search */
export const SEARCH_MIN_LENGTH = 2;

/** Number of hourly points shown in temperature chart */
export const TEMPERATURE_CHART_HOURS = 48;

/** Server-side cache: forecast (seconds) */
export const FORECAST_REVALIDATE_SECONDS = 600;

/** Server-side cache: geocoding search (seconds) */
export const GEOCODING_REVALIDATE_SECONDS = 3600;

/** Country filter for geocoding (Australia) */
export const COUNTRY_CODE_AU = "AU";
