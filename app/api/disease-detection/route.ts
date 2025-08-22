import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageData } = body

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: "Image data is required" },
        { status: 400 }
      )
    }

    // Prepare prompt for A4F API
    const prompt = `You are an expert agricultural scientist specializing in crop disease detection. Analyze this crop image and provide a detailed assessment in plain text format.

Please provide:
1. Any visible diseases or health issues detected
2. Severity level (High/Medium/Low/None)
3. Specific disease names if identifiable
4. Treatment recommendations
5. Prevention measures
6. Overall crop health assessment

Format your response in clear, simple text that a farmer can easily understand. Focus on practical advice and actionable recommendations. If no diseases are detected, mention that the crop appears healthy and provide general care tips.

Keep the response concise but comprehensive, suitable for immediate farming decisions.`

    // Call A4F API with GPT-5 Nano
    const a4fResponse = await fetch(process.env.A4F_BASE_URL + '/chat/completions', {
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
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    })

    if (!a4fResponse.ok) {
      const errorData = await a4fResponse.text()
      console.error('A4F API error:', errorData)
      return NextResponse.json(
        { success: false, error: "Failed to analyze image" },
        { status: 500 }
      )
    }

    const aiResponse = await a4fResponse.json()
    const diseaseAnalysis = aiResponse.choices?.[0]?.message?.content || "No analysis available"

    return NextResponse.json({
      success: true,
      data: {
        diseaseAnalysis,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Disease detection error:', error)
    return NextResponse.json(
      { success: false, error: "Failed to analyze image for diseases" },
      { status: 500 }
    )
  }
}
