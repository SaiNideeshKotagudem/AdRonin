import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OpenAI API key not found. AI features will use mock responses.');
}

export const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Only for demo purposes
}) : null;

export const generateCampaignPlan = async (
  businessGoal: string,
  targetAudience: string,
  budget: number
): Promise<any> => {
  if (!openai) {
    // Mock response for demo
    return {
      strategy: 'Multi-channel digital marketing approach',
      channels: ['Google Ads', 'Meta Ads', 'LinkedIn', 'Email Marketing'],
      timeline: '4 weeks',
      budget_allocation: {
        'Google Ads': 40,
        'Meta Ads': 30,
        'LinkedIn': 20,
        'Email Marketing': 10
      },
      targeting_suggestions: [
        'Demographics: Age 25-45, Urban professionals',
        'Interests: Technology, Business growth',
        'Behaviors: Frequent online shoppers'
      ]
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3",
      messages: [
        {
          role: "system",
          content: "You are an expert digital marketing strategist. Create comprehensive campaign plans."
        },
        {
          role: "user",
          content: `Create a digital marketing campaign plan for:
          Business Goal: ${businessGoal}
          Target Audience: ${targetAudience}
          Budget: $${budget}
          
          Return a JSON object with strategy, channels, timeline, budget_allocation, and targeting_suggestions.`
        }
      ],
      temperature: 0.7,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

export const generateAdCopy = async (
  product: string,
  audience: string,
  platform: string
): Promise<string[]> => {
  if (!openai) {
    return [
      `Discover ${product} - Perfect for ${audience}!`,
      `Transform your business with ${product}`,
      `Join thousands who trust ${product}`
    ];
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3",
      messages: [
        {
          role: "system",
          content: "You are a creative copywriter specializing in digital advertising."
        },
        {
          role: "user",
          content: `Generate 3 compelling ad copy variations for:
          Product: ${product}
          Audience: ${audience}
          Platform: ${platform}
          
          Return as an array of strings.`
        }
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content;
    return content ? JSON.parse(content) : [];
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};

export const generateInsights = async (performanceData: any): Promise<string> => {
  if (!openai) {
    return "Based on the performance data, your campaigns are showing strong engagement with a 15% improvement in CTR. Consider increasing budget allocation to top-performing ad sets.";
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3",
      messages: [
        {
          role: "system",
          content: "You are a data analyst specializing in marketing performance insights."
        },
        {
          role: "user",
          content: `Analyze this campaign performance data and provide actionable insights:
          ${JSON.stringify(performanceData)}
          
          Focus on key metrics, trends, and recommendations for optimization.`
        }
      ],
      temperature: 0.6,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
};