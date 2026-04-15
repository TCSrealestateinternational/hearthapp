import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { address } = await request.json();

  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_ROUTES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google API key not configured" },
      { status: 500 }
    );
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) {
    return NextResponse.json(
      { error: "Google Geocoding API error" },
      { status: 502 }
    );
  }

  const json = await res.json();
  const result = json.results?.[0];

  if (!result) {
    return NextResponse.json({ lat: null, lon: null });
  }

  return NextResponse.json({
    lat: result.geometry.location.lat,
    lon: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  });
}
