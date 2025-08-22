import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const URL = process.env.NEXT_PUBLIC_BACKEND_URL
    // Call your FastAPI backend
    const res = await fetch(`${URL}/predict-crop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch from backend" },
        { status: 500 }
      );
    }

    const data = await res.json();

    console.log(data)
    // Use the correct property returned by FastAPI, which is top_recommendations
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
