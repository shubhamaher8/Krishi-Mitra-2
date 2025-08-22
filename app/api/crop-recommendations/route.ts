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

Please provide:
1. Top 3-4 recommended crops with their suitability percentage
2. Expected yield for each crop
3. Profitability assessment (High/Medium/Low)
4. Specific reasons for each recommendation
5. Any additional farming advice

Format your response in a clear, structured manner suitable for farmers. Focus on crops commonly grown in India.`

    // Call OpenRouter API with Mistral AI
    const openRouterResponse = await fetch(process.env.OPENROUTER_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-domain.com', // Replace with your actual domain
        'X-Title': 'Crop Recommendation System'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
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
