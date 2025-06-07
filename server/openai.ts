import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function analyzeVoiceStyle(text: string): Promise<{
  tone: string;
  style: string;
  confidence: number;
  sentiment: string;
  energy: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a voice and communication style expert. Analyze the given text for communication patterns and respond with JSON in this exact format: 
          {
            "tone": "string (e.g., friendly, professional, casual, enthusiastic, etc.)",
            "style": "string (e.g., conversational, formal, direct, diplomatic, etc.)",
            "confidence": number (0-1, how confident you are in the analysis),
            "sentiment": "string (positive, negative, neutral)",
            "energy": "string (high, medium, low)"
          }`
        },
        {
          role: "user",
          content: `Analyze this text: "${text}"`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      tone: result.tone || "neutral",
      style: result.style || "conversational",
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      sentiment: result.sentiment || "neutral",
      energy: result.energy || "medium"
    };
  } catch (error) {
    console.error("Failed to analyze voice style:", error);
    
    // Check if it's a quota issue and provide demo analysis
    if (error.status === 429 || error.message?.includes('quota')) {
      return generateDemoAnalysis(text);
    }
    
    throw new Error("Failed to analyze voice style: " + error.message);
  }
}

function generateDemoAnalysis(text: string): {
  tone: string;
  style: string;
  confidence: number;
  sentiment: string;
  energy: string;
} {
  // Simple demo analysis based on text characteristics
  const words = text.toLowerCase().split(' ');
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  
  let tone = "friendly";
  let style = "conversational";
  let sentiment = "neutral";
  let energy = "medium";
  
  // Basic analysis
  if (exclamationCount > 0) {
    tone = "enthusiastic";
    energy = "high";
    sentiment = "positive";
  }
  
  if (questionCount > 0) {
    tone = "curious";
    style = "inquisitive";
  }
  
  if (words.some(word => ['great', 'awesome', 'love', 'amazing', 'wonderful'].includes(word))) {
    sentiment = "positive";
    tone = "enthusiastic";
  }
  
  if (words.some(word => ['please', 'thank', 'sorry', 'excuse'].includes(word))) {
    tone = "polite";
    style = "formal";
  }
  
  return {
    tone,
    style,
    confidence: 0.7,
    sentiment,
    energy
  };
}

export async function generateAITwinResponse(
  userText: string, 
  voiceAnalysis: any, 
  conversationHistory: Array<{text: string, isUser: boolean}>
): Promise<string> {
  try {
    const recentHistory = conversationHistory.slice(-6); // Last 3 exchanges
    const historyContext = recentHistory.map(msg => 
      `${msg.isUser ? 'User' : 'AI Twin'}: ${msg.text}`
    ).join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI Twin that mimics the user's communication style. Based on the analysis, respond as if you are the user talking to themselves. 

          User's communication style:
          - Tone: ${voiceAnalysis.tone}
          - Style: ${voiceAnalysis.style}
          - Sentiment: ${voiceAnalysis.sentiment}
          - Energy: ${voiceAnalysis.energy}

          Match their tone, energy level, and speaking style. Use similar language patterns and enthusiasm level. Be conversational and respond as their digital twin would.

          Recent conversation context:
          ${historyContext}

          Important: Keep responses concise (1-3 sentences) and natural. Mirror their communication style exactly.`
        },
        {
          role: "user",
          content: userText
        }
      ],
    });

    return response.choices[0].message.content || "I understand what you're saying!";
  } catch (error) {
    console.error("Failed to generate AI twin response:", error);
    
    // Check if it's a quota issue and provide demo response
    if (error.status === 429 || error.message?.includes('quota')) {
      return generateDemoResponse(userText, voiceAnalysis);
    }
    
    throw new Error("Failed to generate response: " + error.message);
  }
}

function generateDemoResponse(userText: string, voiceAnalysis: any): string {
  const { tone, style, sentiment, energy } = voiceAnalysis;
  
  // Generate a simple response based on the analysis
  const responses = {
    enthusiastic: [
      "That's exactly what I was thinking!",
      "I love how you put that!",
      "Yes, absolutely! That makes perfect sense!"
    ],
    curious: [
      "That's interesting... tell me more about that.",
      "I wonder if there's another way to look at this?",
      "What do you think would happen if we tried a different approach?"
    ],
    polite: [
      "I appreciate you sharing that perspective.",
      "Thank you for bringing that up.",
      "That's a thoughtful way to look at it."
    ],
    friendly: [
      "I totally get what you mean!",
      "That sounds really good to me.",
      "I'm with you on that one."
    ]
  };
  
  const toneResponses = responses[tone] || responses.friendly;
  const randomResponse = toneResponses[Math.floor(Math.random() * toneResponses.length)];
  
  // Add energy-based modifications
  if (energy === "high") {
    return randomResponse + " Let's dive deeper into this!";
  } else if (energy === "low") {
    return randomResponse.toLowerCase().replace(/!$/, ".");
  }
  
  return randomResponse;
}

export async function updateVoiceProfile(existingProfile: any, newAnalysis: any): Promise<any> {
  if (!existingProfile) {
    return {
      averageTone: newAnalysis.tone,
      commonPhrases: [],
      speakingStyle: newAnalysis.style,
      confidenceLevel: newAnalysis.confidence
    };
  }

  // Simple profile updating logic - in a real app this would be more sophisticated
  return {
    ...existingProfile,
    averageTone: newAnalysis.tone, // Could average with existing
    speakingStyle: newAnalysis.style,
    confidenceLevel: (existingProfile.confidenceLevel + newAnalysis.confidence) / 2
  };
}
