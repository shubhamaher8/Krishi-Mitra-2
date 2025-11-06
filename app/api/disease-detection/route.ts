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
    const prompt = `You are an expert agricultural scientist specializing in crop disease detection. Analyze this crop image and provide a quick assessment in **Markdown format**.

start each point on new line 

Please provide:
**Confidence Level**: [Percentage of being accurate]
**Detected Issue**: [Name of disease and plant infected name or "None detected"]
**Severity**: [High/Medium/Low/None]
**Treatment**: [Medium length, actionable treatment recommendations]
**Prevention**: [Medium length, actionable prevention tips]

**Format your response in Markdown using bold labels and bullet points.**

Example format:
**🌱 KrishiMitra 2.0: Disease Detection Report**
**📊 Confidence Level**: 
• 82% 
**🩺 Detected Issue**: 
• Bacterial Blight on Tomato
**⚠️ Severity**: 
• Medium
**💊 Treatment**: 
• 🧴Apply a copper-based bactericide. 
• 🔥Remove and destroy severely affected leaves and plants to prevent spread.
**🛡️ Prevention**: 
• 🌬️Ensure proper spacing between plants for air circulation. 
• 🌱Use disease-free seeds and avoid overhead irrigation.

Format your response in clear, simple text that a farmer can easily understand. Focus on practical advice and actionable recommendations. If no diseases are detected, mention that the crop appears healthy and provide general care tips.

Keep the response concise, suitable for immediate farming decisions. Format everything in Markdown.`

    // Call A4F API with GPT-5 Nano
    const a4fResponse = await fetch(process.env.A4F_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.A4F_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "provider-5/gpt-5-nano",
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
        max_tokens: 9000,
        temperature: 0.5
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
