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
    const prompt = `You are an expert agricultural economist specializing in Indian crop markets. Based on the following information, provide a price prediction analysis in **Markdown format**:

Crop: ${crop}
District: ${district}

Provide the analysis in this specific format, using bold labels and bullet points for key factors:
Seprate each factor and start on the new line
**🌱 KrishiMitra 2.0: Price Predictions**
**Current Price**: [value in price per Quintal]
**Predicted Price**: [value in price per Quintal]
**Market Confidence**: [percentage]
**Key Factors**:
• [factor 1]
• [factor 2]
• [factor 3]
• [factor 4]


Example format:
**🌱 KrishiMitra 2.0: Price Predictions**
**💰 Current Price**: ₹2927 per Quintal
**📊 Predicted Price**: ₹4500 - ₹5500 per Quintal (over the next 2 weeks)
**✅ Market Confidence**: 85%
**🔑 Key Factors**:
• 🌧️ Monsoon rains affecting supply in nearby growing regions
• 🛒 Demand from local markets and hotels
• 🚚 Transport and logistics costs
• 📊 Prevailing wholesale market prices

Keep the response easy to read, suitable for immediate farming decisions. Format everything in Markdown.`

    // Call OpenRouter API with Mistral AI
    const openRouterResponse = await fetch(process.env.A4F_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.A4F_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'provider-6/gpt-4.1-nano',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 7200,
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
