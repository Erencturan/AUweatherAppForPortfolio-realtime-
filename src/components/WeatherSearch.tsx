"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GeocodingResult } from "@/types/weather";
import { useDebouncedValue } from "@/hooks";
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from "@/constants";

interface WeatherSearchProps {
  onSelect: (result: GeocodingResult) => void;
  placeholder?: string;
}

export function WeatherSearch({
  onSelect,
  placeholder = "Search Australian cities…",
}: WeatherSearchProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < SEARCH_MIN_LENGTH) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Search failed");
      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      onSelect(result);
      setQuery(result.name);
      setResults([]);
      setOpen(false);
    },
    [onSelect]
  );

  const showDropdown =
    open && (results.length > 0 || (query.length >= SEARCH_MIN_LENGTH && !loading && !error));

  return (
    <div className="relative w-full max-w-md" ref={wrapperRef}>
      <div className="flex rounded-xl border border-[var(--border)] bg-[var(--surface)] focus-within:ring-2 focus-within:ring-[var(--accent)]">
        <span className="flex items-center pl-4 text-[var(--muted)]" aria-hidden>
          Search
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-full bg-transparent py-3 pr-4 pl-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none"
          aria-label="Search cities"
        />
        {loading && (
          <span className="flex items-center pr-4" aria-hidden>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-[var(--error)]" role="alert">
          {error}
        </p>
      )}
      {showDropdown && (
        <ul
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg"
          role="listbox"
        >
          {results.length === 0 && (
            <li className="px-4 py-3 text-[var(--muted)]">No cities found</li>
          )}
          {results.map((r) => (
            <li
              key={`${r.id}-${r.latitude}-${r.longitude}`}
              role="option"
              aria-selected={false}
              tabIndex={0}
              className="cursor-pointer px-4 py-3 text-[var(--text)] hover:bg-[var(--border)] focus:bg-[var(--border)] focus:outline-none"
              onClick={() => handleSelect(r)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(r);
                }
              }}
            >
              <span className="font-medium">{r.name}</span>
              {r.admin1 && (
                <span className="ml-2 text-sm text-[var(--muted)]">{r.admin1}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
