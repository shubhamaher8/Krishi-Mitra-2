import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { crop, district } = body

    if (!crop || !district) {
      return NextResponse.json(
        { success: false, error: "Crop and district are required" },
        { status: 400 }
      )
    }

    // Prepare prompt for Mistral AI
    const prompt = `You are an expert agricultural economist specializing in Indian crop markets. Based on the following information, provide a detailed price prediction analysis:

Crop: ${crop}
District: ${district}

Please provide a comprehensive analysis including:

1. Current market price trends for ${crop} in ${district}
2. 3-month price forecast with percentage change
3. 6-month price forecast with percentage change
4. Key factors influencing price movements (weather, demand, supply, government policies, etc.)
5. Market confidence level (High/Medium/Low) with percentage
6. Risk factors that could affect prices
7. Recommendations for farmers (when to sell, storage advice, etc.)
8. Historical price patterns and seasonal trends

Format your response in clear, structured text that farmers can easily understand. Focus on practical insights and actionable advice. Include specific price ranges and percentages where possible.

Keep the response comprehensive but easy to read, suitable for immediate farming decisions.`

    // Call OpenRouter API with Mistral AI
    const openRouterResponse = await fetch(process.env.OPENROUTER_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-domain.com', // Replace with your actual domain
        'X-Title': 'Price Prediction System'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-small-3.2-24b-instruct:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.3
      })
    })

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { success: false, error: "Failed to get price predictions" },
        { status: 500 }
      )
    }

    const aiResponse = await openRouterResponse.json()
    const pricePredictions = aiResponse.choices?.[0]?.message?.content || "No predictions available"

    return NextResponse.json({
      success: true,
      data: {
        pricePredictions,
        crop,
        district,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Price predictions error:', error)
    return NextResponse.json(
      { success: false, error: "Failed to get price predictions" },
      { status: 500 }
    )
  }
}
