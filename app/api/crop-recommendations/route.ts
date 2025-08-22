import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = body

    // Validate required fields
    if (!nitrogen || !phosphorus || !potassium || !temperature || !humidity || !ph || !rainfall) {
      return NextResponse.json(
        { success: false, error: "All soil and weather parameters are required" },
        { status: 400 }
      )
    }

    // Prepare prompt for Mistral AI
    const prompt = `You are an expert agricultural scientist. Based on the following soil and weather conditions, provide detailed crop recommendations for Indian farming:

Soil Parameters:
- Nitrogen (N): ${nitrogen} mg/kg
- Phosphorus (P): ${phosphorus} mg/kg  
- Potassium (K): ${potassium} mg/kg
- pH: ${ph}

Weather Conditions:
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Rainfall: ${rainfall} mm

Please provide a list of the top 3 recommended crops. For each crop, include the following:
Crop Name
Short Reasons: Provide a four-word bullet point for the recommendation, summarizing why it's a good choice based on the provided data.
Example Format:
crop : Maize
reason : High humidity, balanced nutrients.

Format your response in a clear, structured manner suitable for farmers. Focus on crops commonly grown in India.`

    // Call OpenRouter API with Mistral AI
    const openRouterResponse = await fetch(process.env.A4F_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.A4F_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "provider-3/gpt-5-nano",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 9000,
        temperature: 0.7
      })
    })

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { success: false, error: "Failed to get AI recommendations" },
        { status: 500 }
      )
    }

    const aiResponse = await openRouterResponse.json()
    const aiRecommendations = aiResponse.choices?.[0]?.message?.content || "No recommendations available"

    return NextResponse.json({
      success: true,
      data: {
        aiRecommendations,
        inputParameters: {
          nitrogen,
          phosphorus,
          potassium,
          temperature,
          humidity,
          ph,
          rainfall
        }
      }
    })

  } catch (error) {
    console.error('Crop recommendations error:', error)
    return NextResponse.json(
      { success: false, error: "Failed to get crop recommendations" },
      { status: 500 }
    )
  }
}
