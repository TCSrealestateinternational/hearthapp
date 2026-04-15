"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Footprints,
  Bus,
  Bike,
  Shield,
  Car,
  School,
  ExternalLink,
  RefreshCw,
  MapPin,
  Star,
  Loader2,
} from "lucide-react";

// ─── Nearby Places categories ───────────────────────────────────────────────

const PLACE_CATEGORIES = [
  { label: "Grocery", type: "grocery_store" },
  { label: "Hospital", type: "hospital" },
  { label: "Restaurant", type: "restaurant" },
  { label: "Gas Station", type: "gas_station" },
  { label: "Pharmacy", type: "pharmacy" },
  { label: "Gym", type: "gym" },
  { label: "Bank", type: "bank" },
] as const;

// ─── Score card ─────────────────────────────────────────────────────────────

function ScoreCard({
  label,
  score,
  icon: Icon,
  color,
}: {
  label: string;
  score: number | null;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}) {
  if (score == null) return null;
  return (
    <div className="flex flex-col items-center p-3 bg-surface-container rounded-xl">
      <Icon size={18} className={`${color} mb-1`} />
      <span className="text-2xl font-bold text-text-primary">{score}</span>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface WalkData {
  walkScore: number | null;
  transitScore: number | null;
  bikeScore: number | null;
  description: string;
}

interface CrimeData {
  crimeIndex: number | null;
  year?: number;
  violentCrime?: number;
  propertyCrime?: number;
  population?: number;
}

interface CommuteData {
  commuteMinutes: number | null;
  distanceMiles: number | null;
}

interface NearbyPlace {
  name: string;
  address: string;
  rating: number | null;
  types: string[];
}

interface NeighborhoodDataProps {
  address: string;
  city: string;
  state: string;
  zip: string;
  commuteDestination?: string;
}

// ─── Main component ─────────────────────────────────────────────────────────

export function NeighborhoodData({
  address,
  city,
  state,
  zip,
  commuteDestination,
}: NeighborhoodDataProps) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [walkData, setWalkData] = useState<WalkData | null>(null);
  const [crimeData, setCrimeData] = useState<CrimeData | null>(null);
  const [commuteData, setCommuteData] = useState<CommuteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Nearby Places — keyed by category type
  const [nearbyResults, setNearbyResults] = useState<
    Record<string, NearbyPlace[]>
  >({});
  const [nearbyLoading, setNearbyLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [nearbyErrors, setNearbyErrors] = useState<Record<string, string>>({});

  const fullAddress = `${address}, ${city}, ${state} ${zip}`;

  const fetchData = useCallback(async () => {
    if (!address || !city || !state) return;

    setLoading(true);
    setErrors({});
    setWalkData(null);
    setCrimeData(null);
    setCommuteData(null);
    setCoords(null);

    // Step 1: Geocode the address to get lat/lon
    let lat: number | null = null;
    let lon: number | null = null;

    try {
      const geoRes = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: fullAddress }),
      });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        lat = geoData.lat;
        lon = geoData.lon;
        if (lat != null && lon != null) {
          setCoords({ lat, lon });
        }
      }
    } catch {
      setErrors((prev) => ({ ...prev, geo: "Geocoding failed" }));
    }

    // Step 2: Fetch all data in parallel
    const promises: Promise<void>[] = [];

    // Walk Score
    if (lat != null && lon != null) {
      promises.push(
        fetch("/api/walkscore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: fullAddress, lat, lon }),
        })
          .then(async (r) => {
            if (!r.ok) throw new Error("Walk Score unavailable");
            setWalkData(await r.json());
          })
          .catch((err) =>
            setErrors((prev) => ({ ...prev, walk: err.message }))
          )
      );
    }

    // Crime Data — use 2-letter state abbreviation
    if (state && state.length === 2) {
      promises.push(
        fetch("/api/crimedata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stateAbbr: state }),
        })
          .then(async (r) => {
            if (!r.ok) throw new Error("Crime data unavailable");
            setCrimeData(await r.json());
          })
          .catch((err) =>
            setErrors((prev) => ({ ...prev, crime: err.message }))
          )
      );
    }

    // Commute — needs a destination
    if (commuteDestination && lat != null && lon != null) {
      promises.push(
        fetch("/api/commute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            originLat: lat,
            originLon: lon,
            destAddress: commuteDestination,
          }),
        })
          .then(async (r) => {
            if (!r.ok) throw new Error("Commute data unavailable");
            setCommuteData(await r.json());
          })
          .catch((err) =>
            setErrors((prev) => ({ ...prev, commute: err.message }))
          )
      );
    }

    await Promise.allSettled(promises);
    setLoading(false);
  }, [address, city, state, zip, fullAddress, commuteDestination]);

  // Auto-fetch when inputs change
  useEffect(() => {
    fetchData();
    setNearbyResults({});
    setNearbyLoading({});
    setNearbyErrors({});
  }, [fetchData]);

  // Toggle a nearby-places category chip
  const toggleCategory = useCallback(
    async (type: string) => {
      // If already loaded, remove it (toggle off)
      if (nearbyResults[type]) {
        setNearbyResults((prev) => {
          const next = { ...prev };
          delete next[type];
          return next;
        });
        setNearbyErrors((prev) => {
          const next = { ...prev };
          delete next[type];
          return next;
        });
        return;
      }

      if (!coords) return;

      setNearbyLoading((prev) => ({ ...prev, [type]: true }));
      setNearbyErrors((prev) => {
        const next = { ...prev };
        delete next[type];
        return next;
      });

      try {
        const res = await fetch("/api/places/nearby", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: coords.lat, lon: coords.lon, type }),
        });
        if (!res.ok) throw new Error("Places API error");
        const data = await res.json();
        setNearbyResults((prev) => ({ ...prev, [type]: data.places }));
      } catch (err) {
        setNearbyErrors((prev) => ({
          ...prev,
          [type]: err instanceof Error ? err.message : "Unknown error",
        }));
      } finally {
        setNearbyLoading((prev) => {
          const next = { ...prev };
          delete next[type];
          return next;
        });
      }
    },
    [coords, nearbyResults]
  );

  // ── Nothing to show yet ───────────────────────────────────────────────────

  if (!address || !city || !state) {
    return (
      <div className="text-xs text-text-secondary italic py-2">
        Enter an address to see neighborhood data.
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Refresh button */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Neighborhood Data
        </h4>
        <button
          onClick={fetchData}
          disabled={loading}
          className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 transition-colors disabled:opacity-40"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading\u2026" : "Refresh"}
        </button>
      </div>

      {/* Walk / Transit / Bike Scores */}
      <div>
        <h4 className="text-xs font-medium text-text-primary mb-2">
          Walkability
        </h4>
        {loading && !walkData ? (
          <p className="text-xs text-text-secondary animate-pulse">
            Loading scores\u2026
          </p>
        ) : walkData ? (
          <div className="grid grid-cols-3 gap-2">
            <ScoreCard
              label="Walk"
              score={walkData.walkScore}
              icon={Footprints}
              color="text-emerald-500"
            />
            <ScoreCard
              label="Transit"
              score={walkData.transitScore}
              icon={Bus}
              color="text-blue-500"
            />
            <ScoreCard
              label="Bike"
              score={walkData.bikeScore}
              icon={Bike}
              color="text-amber-500"
            />
          </div>
        ) : errors.walk ? (
          <p className="text-xs text-text-secondary">
            Walk score data unavailable
          </p>
        ) : null}
      </div>

      {/* Safety / Crime */}
      <div>
        <h4 className="text-xs font-medium text-text-primary mb-2">Safety</h4>
        {loading && !crimeData ? (
          <p className="text-xs text-text-secondary animate-pulse">
            Loading safety data\u2026
          </p>
        ) : crimeData?.crimeIndex != null ? (
          <div className="flex items-center gap-3">
            <Shield size={18} className="text-text-secondary shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-primary font-medium">
                  Crime Index
                </span>
                <span className="text-text-secondary">
                  {crimeData.crimeIndex}/100 (state level
                  {crimeData.year ? `, ${crimeData.year}` : ""})
                </span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    crimeData.crimeIndex < 30
                      ? "bg-emerald-500"
                      : crimeData.crimeIndex < 60
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${crimeData.crimeIndex}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">
                {crimeData.crimeIndex < 30
                  ? "Below average crime"
                  : crimeData.crimeIndex < 60
                    ? "Average crime levels"
                    : "Above average crime"}
              </p>
            </div>
          </div>
        ) : errors.crime ? (
          <p className="text-xs text-text-secondary">
            Safety data unavailable
          </p>
        ) : null}
      </div>

      {/* Commute */}
      {(commuteData ||
        errors.commute ||
        (commuteDestination && loading)) && (
        <div>
          <h4 className="text-xs font-medium text-text-primary mb-2">
            Commute Estimate
          </h4>
          {loading && !commuteData ? (
            <p className="text-xs text-text-secondary animate-pulse">
              Calculating commute\u2026
            </p>
          ) : commuteData?.commuteMinutes != null ? (
            <div className="flex items-center gap-3">
              <Car size={18} className="text-text-secondary shrink-0" />
              <div>
                <span className="text-lg font-bold text-text-primary">
                  {commuteData.commuteMinutes} min
                </span>
                {commuteData.distanceMiles != null && (
                  <span className="text-xs text-text-secondary ml-2">
                    ({commuteData.distanceMiles} mi)
                  </span>
                )}
                <p className="text-xs text-text-secondary">
                  Estimated drive with traffic
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-secondary">
              Commute data unavailable
            </p>
          )}
        </div>
      )}

      {/* Schools — link out to GreatSchools */}
      <div>
        <h4 className="text-xs font-medium text-text-primary mb-2">Schools</h4>
        <a
          href={`https://www.greatschools.org/search/search.page?q=${encodeURIComponent(fullAddress)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <School size={14} />
          View schools on GreatSchools
          <ExternalLink size={11} />
        </a>
      </div>

      {/* Nearby Places */}
      <div>
        <h4 className="text-xs font-medium text-text-primary mb-2">
          Nearby Places
        </h4>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {PLACE_CATEGORIES.map(({ label, type }) => {
            const active = !!nearbyResults[type];
            const busy = !!nearbyLoading[type];
            return (
              <button
                key={type}
                onClick={() => toggleCategory(type)}
                disabled={busy || !coords}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-white"
                    : "bg-surface-container text-text-secondary hover:text-text-primary"
                } disabled:opacity-50`}
              >
                {busy && <Loader2 size={11} className="animate-spin" />}
                {label}
              </button>
            );
          })}
        </div>

        {/* Results for each active category */}
        {PLACE_CATEGORIES.map(({ label, type }) => {
          const places = nearbyResults[type];
          const error = nearbyErrors[type];
          if (!places && !error) return null;
          return (
            <div key={type} className="mb-3">
              <p className="text-xs font-medium text-text-secondary mb-1">
                {label}
              </p>
              {error ? (
                <p className="text-xs text-text-secondary">
                  Could not load {label.toLowerCase()} results
                </p>
              ) : places.length === 0 ? (
                <p className="text-xs text-text-secondary italic">
                  No {label.toLowerCase()} found nearby
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {places.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <MapPin
                        size={12}
                        className="text-text-secondary shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <span className="font-medium text-text-primary">
                          {p.name}
                        </span>
                        {p.rating != null && (
                          <span className="inline-flex items-center gap-0.5 ml-1.5 text-amber-500">
                            <Star size={10} fill="currentColor" />
                            {p.rating}
                          </span>
                        )}
                        {p.address && (
                          <p className="text-text-secondary truncate">
                            {p.address}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* Attribution */}
      <p className="text-xs text-text-secondary/60 leading-relaxed">
        Walk Score&reg; data from{" "}
        <a
          href="https://www.walkscore.com"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-text-secondary"
        >
          walkscore.com
        </a>
        . Crime data from FBI UCR. Commute via Google Routes. Nearby places via
        Google.
      </p>
    </div>
  );
}
