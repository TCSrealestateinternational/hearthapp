import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { stateAbbr } = await request.json();

  if (!stateAbbr) {
    return NextResponse.json(
      { error: "stateAbbr is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.FBI_CRIME_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "FBI Crime API key not configured" },
      { status: 500 }
    );
  }

  const url = `https://api.usa.gov/crime/fbi/sapi/api/estimates/states/${stateAbbr.toLowerCase()}?api_key=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) {
    return NextResponse.json(
      { error: "FBI Crime API error" },
      { status: 502 }
    );
  }

  const json = await res.json();
  const results = json.results ?? [];

  if (results.length === 0) {
    return NextResponse.json({ crimeIndex: null });
  }

  const latest = results[results.length - 1];
  const population = latest.population || 1;
  const totalCrime = (latest.violent_crime || 0) + (latest.property_crime || 0);
  const crimeIndex = Math.min(
    100,
    Math.round(((totalCrime / population) / 0.06) * 100)
  );

  return NextResponse.json({
    crimeIndex,
    year: latest.year,
    violentCrime: latest.violent_crime,
    propertyCrime: latest.property_crime,
    population,
  });
}
