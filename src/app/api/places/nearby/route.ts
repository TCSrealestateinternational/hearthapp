import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { lat, lon, type } = await request.json();

  if (lat == null || lon == null) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }
  if (!type) {
    return NextResponse.json(
      { error: "type is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_ROUTES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google API key not configured" },
      { status: 500 }
    );
  }

  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.displayName,places.rating,places.formattedAddress,places.location,places.types",
    },
    body: JSON.stringify({
      includedTypes: [type],
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lon },
          radiusMeters: 8000,
        },
      },
      maxResultCount: 5,
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Google Places API error" },
      { status: 502 }
    );
  }

  const json = await res.json();
  const places = (json.places || []).map(
    (p: {
      displayName?: { text?: string };
      formattedAddress?: string;
      rating?: number;
      types?: string[];
    }) => ({
      name: p.displayName?.text || "Unknown",
      address: p.formattedAddress || "",
      rating: p.rating ?? null,
      types: p.types || [],
    })
  );

  return NextResponse.json({ places });
}
