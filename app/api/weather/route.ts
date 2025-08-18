import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  const apiHost = process.env.WEATHER_API_HOST;

  if (!apiKey || !apiHost) {
    return NextResponse.json({ error: 'Weather API environment variables not set' }, { status: 500 });
  }

  try {
    const response = await fetch(`${apiHost}?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=no`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Weather API error:', errorData);
      return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Internal error fetching weather data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}