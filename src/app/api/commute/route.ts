import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { originLat, originLon, destAddress, destLat, destLon } =
    await request.json();

  if (originLat == null || originLon == null) {
    return NextResponse.json(
      { error: "Origin coordinates are required" },
      { status: 400 }
    );
  }
  if (!destAddress && (destLat == null || destLon == null)) {
    return NextResponse.json(
      { error: "Destination address or coordinates are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_ROUTES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Routes API key not configured" },
      { status: 500 }
    );
  }

  const destination =
    destLat != null && destLon != null
      ? {
          waypoint: {
            location: { latLng: { latitude: destLat, longitude: destLon } },
          },
        }
      : { waypoint: { address: destAddress } };

  const url =
    "https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "originIndex,destinationIndex,duration,distanceMeters,condition",
    },
    body: JSON.stringify({
      origins: [
        {
          waypoint: {
            location: {
              latLng: { latitude: originLat, longitude: originLon },
            },
          },
          routeModifiers: {
            avoidFerries: false,
            avoidHighways: false,
            avoidTolls: false,
          },
        },
      ],
      destinations: [destination],
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Google Routes API error" },
      { status: 502 }
    );
  }

  const json = await res.json();
  const route = Array.isArray(json) ? json[0] : json;

  if (!route || route.condition === "ROUTE_NOT_FOUND") {
    return NextResponse.json({ commuteMinutes: null, distanceMiles: null });
  }

  const durationSeconds =
    parseInt((route.duration || "0s").replace("s", ""), 10) || 0;
  const commuteMinutes = Math.round(durationSeconds / 60);
  const distanceMiles =
    Math.round(((route.distanceMeters || 0) / 1609.344) * 10) / 10;

  return NextResponse.json({ commuteMinutes, distanceMiles });
}
