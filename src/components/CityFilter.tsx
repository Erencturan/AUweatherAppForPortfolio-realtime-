"use client";

import { AUSTRALIAN_CITIES, type CityId } from "@/lib/cities";

interface CityFilterProps {
  selectedId: CityId | null;
  onSelect: (id: CityId, lat: number, lon: number) => void;
}

const buttonBase =
  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";
const buttonSelected =
  "border-[var(--accent)] bg-[var(--accent)] text-white";
const buttonDefault =
  "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--muted)]";

export function CityFilter({ selectedId, onSelect }: CityFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {AUSTRALIAN_CITIES.map((city) => (
        <button
          key={city.id}
          type="button"
          onClick={() => onSelect(city.id, city.lat, city.lon)}
          className={`${buttonBase} ${selectedId === city.id ? buttonSelected : buttonDefault}`}
        >
          {city.name}
          <span className="ml-1 text-xs opacity-80">{city.state}</span>
        </button>
      ))}
    </div>
  );
}
