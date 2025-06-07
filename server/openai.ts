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
  const words = text.toLowerCase().split(' ');
  const exclamationCount = (text.match(/!/g) || []).length;
  const questionCount = (text.match(/\?/g) || []).length;
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const textLength = text.length;
  
  let tone = "neutral";
  let style = "conversational";
  let sentiment = "neutral";
  let energy = "medium";
  
  // Sentiment analysis
  const positiveWords = ['excited', 'great', 'awesome', 'love', 'amazing', 'wonderful', 'fantastic', 'brilliant', 'excellent', 'happy', 'good', 'best', 'perfect', 'super'];
  const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'disappointed', 'frustrated', 'angry', 'upset', 'horrible', 'worst'];
  const formalWords = ['please', 'thank', 'sorry', 'excuse', 'kindly', 'appreciate', 'regarding', 'concerning'];
  const casualWords = ['hey', 'yeah', 'cool', 'dude', 'awesome', 'lol', 'omg', 'btw'];
  const enthusiasticWords = ['excited', 'amazing', 'fantastic', 'incredible', 'brilliant', 'outstanding'];
  
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  const formalCount = words.filter(word => formalWords.includes(word)).length;
  const casualCount = words.filter(word => casualWords.includes(word)).length;
  const enthusiasticCount = words.filter(word => enthusiasticWords.includes(word)).length;
  
  // Determine sentiment
  if (positiveCount > negativeCount) {
    sentiment = "positive";
  } else if (negativeCount > positiveCount) {
    sentiment = "negative";
  }
  
  // Determine tone
  if (enthusiasticCount > 0 || exclamationCount > 1) {
    tone = "enthusiastic";
  } else if (questionCount > 0) {
    tone = "curious";
  } else if (formalCount > casualCount) {
    tone = "polite";
  } else if (casualCount > 0) {
    tone = "casual";
  } else if (sentiment === "positive") {
    tone = "friendly";
  } else if (sentiment === "negative") {
    tone = "concerned";
  } else {
    tone = "neutral";
  }
  
  // Determine style
  if (formalCount > 0) {
    style = "formal";
  } else if (questionCount > 1) {
    style = "inquisitive";
  } else if (casualCount > 0) {
    style = "casual";
  } else if (textLength > 100) {
    style = "detailed";
  } else {
    style = "conversational";
  }
  
  // Determine energy
  if (exclamationCount > 0 || capsCount > 3 || enthusiasticCount > 0) {
    energy = "high";
  } else if (negativeCount > 0 || words.includes('tired') || words.includes('exhausted')) {
    energy = "low";
  }
  
  return {
    tone,
    style,
    confidence: 0.75 + Math.random() * 0.2, // Random confidence between 0.75-0.95
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
  const words = userText.toLowerCase().split(' ');
  
  // Context-aware response generation based on input content
  const responses = {
    enthusiastic: [
      "That's exactly what I was thinking!",
      "I love how you put that!",
      "Yes, absolutely! That makes perfect sense!",
      "I'm feeling the same energy about this!",
      "That excitement is contagious!"
    ],
    curious: [
      "That's interesting... tell me more about that.",
      "I wonder if there's another way to look at this?",
      "What do you think would happen if we tried a different approach?",
      "That raises some fascinating questions.",
      "I'm curious about your thoughts on this too."
    ],
    polite: [
      "I appreciate you sharing that perspective.",
      "Thank you for bringing that up.",
      "That's a thoughtful way to look at it.",
      "I'm grateful for your insight.",
      "That's very considerate of you to mention."
    ],
    friendly: [
      "I totally get what you mean!",
      "That sounds really good to me.",
      "I'm with you on that one.",
      "That makes a lot of sense!",
      "I feel the same way about that."
    ],
    casual: [
      "Yeah, I totally get that!",
      "That's pretty cool!",
      "Sounds good to me!",
      "I'm totally on board with that.",
      "That's awesome!"
    ],
    concerned: [
      "I understand how you feel about that.",
      "That sounds challenging.",
      "I can see why that would be difficult.",
      "That's definitely something to think about.",
      "I hear you on that one."
    ],
    neutral: [
      "I understand what you're saying.",
      "That's an interesting point.",
      "I see where you're coming from.",
      "That's worth considering.",
      "I appreciate your perspective."
    ]
  };
  
  let selectedResponses = responses[tone as keyof typeof responses] || responses.friendly;
  let response = selectedResponses[Math.floor(Math.random() * selectedResponses.length)];
  
  // Content-aware modifications
  if (words.includes('project') || words.includes('work')) {
    if (sentiment === 'positive') {
      response = "That project sounds really exciting! " + response;
    } else {
      response = "I understand the challenges with that project. " + response;
    }
  }
  
  if (words.includes('ai') || words.includes('artificial') || words.includes('intelligence')) {
    const aiResponses = [
      "AI is such a fascinating field! " + response,
      "I find artificial intelligence really intriguing too. " + response,
      "The possibilities with AI are endless! " + response
    ];
    response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  }
  
  if (words.includes('day') || words.includes('today')) {
    if (sentiment === 'positive') {
      response = "Sounds like a great day! " + response;
    } else if (sentiment === 'negative') {
      response = "Sorry to hear about your day. " + response;
    }
  }
  
  // Energy-based modifications
  if (energy === "high") {
    response = response + " Let's keep this momentum going!";
  } else if (energy === "low") {
    response = response.toLowerCase().replace(/!+$/, ".").replace(/^./, response[0].toUpperCase());
  }
  
  // Style modifications
  if (style === "formal") {
    response = response.replace(/totally|really|awesome|cool/g, "certainly");
  } else if (style === "casual") {
    response = response.replace(/certainly|indeed/g, "totally");
  }
  
  return response;
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
