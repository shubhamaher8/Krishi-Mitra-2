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
    const prompt = `You are KrishiMitra 2.0, an expert agricultural scientist.  
Based on the following soil and weather conditions, recommend the top 3 crops for Indian farmers with yield probability analysis.  
**Important:** Suggest only crops that are **commonly grown in India**.

### Soil Parameters:
- Nitrogen (N): ${nitrogen} mg/kg
- Phosphorus (P): ${phosphorus} mg/kg
- Potassium (K): ${potassium} mg/kg
- pH: ${ph}

### Weather Conditions:
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Rainfall: ${rainfall} mm

Response Instructions:
1. Answer strictly in **Markdown format**.  
2. Start with the **main headline**:  
   **🌱 KrishiMitra 2.0: Top 3 Crop Recommendations with Yield Analysis**
3. For each crop:  
   - Use a **heading style** with emoji, e.g.:  
     **🌾 Crop 1: Rice**  
   - Add a **medium size bold "Reason" line**, e.g.:  
     **💡 Reason** 
   - List 3  bullet points for reasons. **Do not bold or italicize the bullets**.  
   - Add Yield Probability: X% (where X is a realistic percentage based on conditions)
4. Leave **one empty line** between each crop for visual separation.  
5. Only recommend **regular Indian crops** that are widely cultivated.  
6. Keep the language **simple, actionable, and farmer-friendly**.
7. The percentages should be realistic and based on the soil/weather conditions provided. The crop with highest percentage should be marked as "Best Match".

Example Output:

**🌱 KrishiMitra 2.0: Top 3 Crop Recommendations with Yield Analysis** 
**🌾 Crop 1: Rice**  
**💡 Reason**  
• ✅ Loves high humidity and rainfall  
• ✅ Balanced NPK supports healthy growth  
• ✅ Ideal pH 6.5 for optimal yield
• ✅ Yield Probability: 85%

**🌱 Crop 2: Soybean**
**💡 Reason**
• ✅ Thrives in moderate temperature (24°C)
• ✅ Nitrogen-rich soil boosts protein content
• ✅ Drought-tolerant, suits 138 mm rainfall
• ✅ Yield Probability: 72%

**🌽 Crop 3: Maize**
**💡 Reason**
• ✅ Grows fast in warm, humid conditions
• ✅ Balanced NPK ensures strong cobs
• ✅ pH 6.0-7.0 perfect for maize cultivation
• ✅ Yield Probability: 68%

**Yield Analysis**
• ✅ Rice: 85% (Best Match)
• ✅ Soybean: 72% (Good Match)  
• ✅ Maize: 68% (Moderate Match)
`

    // Call OpenRouter API with Mistral AI
    const openRouterResponse = await fetch(process.env.A4F_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.A4F_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "provider-6/gpt-4.1-nano",
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
