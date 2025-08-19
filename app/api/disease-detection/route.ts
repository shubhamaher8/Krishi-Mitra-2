import { NextResponse } from "next/server";

const URL = process.env.NEXT_PUBLIC_API_URL
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" });
    }

    // Forward request to FastAPI backend
    const backendRes = await fetch(`${URL}/predict-disease`, {
      method: "POST",
      body: formData,
    });

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
