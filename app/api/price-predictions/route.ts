import { NextResponse } from "next/server";
const URL = process.env.NEXT_PUBLIC_BACKEND_URL


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, crop, district, state, date } = body;

    let backendUrl = "";
    if (type === "daily") backendUrl = `${URL}/forecast/daily`;
    else if (type === "weekly") backendUrl = `${URL}/forecast/weekly`;
    else return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });

    // Forecast data
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, state, district, date }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Backend request failed" }, { status: response.status });
    }

    const data = await response.json();

    // Fetch plot URL
    const plotResponse = await fetch(`${URL}/plot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, state, district }),
    });

    let plotUrl: string | null = null;
    if (plotResponse.ok) {
      const plotData = await plotResponse.json();
      plotUrl = plotData.success ? plotData.url : null;
    }

    return NextResponse.json({ ...data, plotUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}