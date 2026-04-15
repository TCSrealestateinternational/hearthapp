import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { address, lat, lon } = await request.json();

  if (!address || lat == null || lon == null) {
    return NextResponse.json(
      { error: "address, lat, and lon are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.WALKSCORE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Walk Score API key not configured" },
      { status: 500 }
    );
  }

  const url = `https://api.walkscore.com/score?format=json&address=${encodeURIComponent(address)}&lat=${lat}&lon=${lon}&transit=1&bike=1&wsapikey=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) {
    return NextResponse.json({ error: "Walk Score API error" }, { status: 502 });
  }

  const json = await res.json();

  return NextResponse.json({
    walkScore: json.walkscore ?? null,
    transitScore: json.transit?.score ?? null,
    bikeScore: json.bike?.score ?? null,
    description: json.description ?? "",
  });
}
