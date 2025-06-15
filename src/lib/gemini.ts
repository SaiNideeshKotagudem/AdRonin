// Google Gemini AI integration (free tier)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. AI features will use mock responses.');
}

const callGeminiAPI = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    // Return mock response when API key is not configured
    return "This is a mock AI response. Please configure your Gemini API key to enable real AI features.";
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

export const generateCampaignPlan = async (
  businessGoal: string,
  targetAudience: string,
  budget: number
): Promise<any> => {
  const prompt = `Create a comprehensive digital marketing campaign plan in JSON format for:

Business Goal: ${businessGoal}
Target Audience: ${targetAudience}
Budget: $${budget}

Return ONLY a valid JSON object with the following structure:
{
  "strategy": "Brief strategy description",
  "channels": ["Google Ads", "Meta Ads", "LinkedIn Ads", "Email Marketing"],
  "timeline": "Campaign duration",
  "budget_allocation": {
    "Google Ads": 40,
    "Meta Ads": 30,
    "LinkedIn Ads": 20,
    "Email Marketing": 10
  },
  "targeting_suggestions": [
    "Demographics suggestion",
    "Interests suggestion", 
    "Behaviors suggestion"
  ]
}`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Extract JSON from response (Gemini sometimes adds extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      strategy: 'AI-powered multi-channel marketing approach',
      channels: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Email Marketing'],
      timeline: '4 weeks',
      budget_allocation: {
        'Google Ads': 40,
        'Meta Ads': 30,
        'LinkedIn Ads': 20,
        'Email Marketing': 10
      },
      targeting_suggestions: [
        'Demographics: Age 25-45, Urban professionals',
        'Interests: Technology, Business growth',
        'Behaviors: Frequent online shoppers'
      ]
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    // Return fallback response
    return {
      strategy: 'Multi-channel digital marketing approach',
      channels: ['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'Email Marketing'],
      timeline: '4 weeks',
      budget_allocation: {
        'Google Ads': 40,
        'Meta Ads': 30,
        'LinkedIn Ads': 20,
        'Email Marketing': 10
      },
      targeting_suggestions: [
        'Demographics: Age 25-45, Urban professionals',
        'Interests: Technology, Business growth',
        'Behaviors: Frequent online shoppers'
      ]
    };
  }
};

export const generateAdCopy = async (
  product: string,
  audience: string,
  platform: string
): Promise<string[]> => {
  const prompt = `Generate 3 compelling ad copy variations for ${platform}:

Product/Service: ${product}
Target Audience: ${audience}
Platform: ${platform}

Return ONLY a JSON array of 3 strings, each being a complete ad copy. Example format:
["Ad copy 1", "Ad copy 2", "Ad copy 3"]`;

  try {
    const response = await callGeminiAPI(prompt);
    
    // Extract JSON array from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return [
      `Discover ${product} - Perfect for ${audience}!`,
      `Transform your business with ${product}`,
      `Join thousands who trust ${product}`
    ];
  } catch (error) {
    console.error('Gemini API error:', error);
    return [
      `Discover ${product} - Perfect for ${audience}!`,
      `Transform your business with ${product}`,
      `Join thousands who trust ${product}`
    ];
  }
};

export const generateInsights = async (performanceData: any): Promise<string> => {
  const prompt = `Analyze this campaign performance data and provide actionable insights:

${JSON.stringify(performanceData, null, 2)}

Provide a concise analysis focusing on:
- Key performance trends
- Optimization recommendations
- Budget allocation suggestions
- Next steps for improvement

Keep the response under 200 words and actionable.`;

  try {
    const response = await callGeminiAPI(prompt);
    return response;
  } catch (error) {
    console.error('Gemini API error:', error);
    return "Based on the performance data, your campaigns are showing engagement patterns. Consider optimizing budget allocation to top-performing channels and refining targeting parameters for better results.";
  }
};