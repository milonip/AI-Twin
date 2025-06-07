import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertConversationSchema } from "@shared/schema";
import { analyzeVoiceStyle, generateAITwinResponse, updateVoiceProfile } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get recent conversations and messages
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      const conversationsWithMessages = await Promise.all(
        conversations.map(async (conv) => {
          const messages = await storage.getMessages(conv.id);
          return { ...conv, messages };
        })
      );
      res.json(conversationsWithMessages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Create a new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Invalid conversation data" });
    }
  });

  // Get messages for a specific conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Process voice message - transcription, analysis, and AI response
  app.post("/api/process-voice", async (req, res) => {
    try {
      const { text, conversationId } = req.body;
      
      if (!text || !conversationId) {
        return res.status(400).json({ error: "Text and conversation ID are required" });
      }

      // Analyze the user's voice/text
      const voiceAnalysis = await analyzeVoiceStyle(text);

      // Create user message
      const userMessage = await storage.createMessage({
        conversationId: parseInt(conversationId),
        isUser: true,
        text,
        voiceAnalysis,
        audioUrl: null
      });

      // Get conversation history for context
      const messages = await storage.getMessages(parseInt(conversationId));
      const conversationHistory = messages.map(msg => ({
        text: msg.text,
        isUser: msg.isUser
      }));

      // Generate AI twin response
      const aiResponse = await generateAITwinResponse(text, voiceAnalysis, conversationHistory);

      // Create AI message
      const aiMessage = await storage.createMessage({
        conversationId: parseInt(conversationId),
        isUser: false,
        text: aiResponse,
        voiceAnalysis: null,
        audioUrl: null
      });

      // Update voice profile (simplified - in practice you'd associate with user)
      const existingProfile = await storage.getVoiceProfile(1); // Default user
      const updatedPatterns = await updateVoiceProfile(existingProfile?.speechPatterns, voiceAnalysis);
      
      if (existingProfile) {
        await storage.updateVoiceProfile(1, { speechPatterns: updatedPatterns });
      } else {
        await storage.createVoiceProfile({
          userId: 1,
          speechPatterns: updatedPatterns
        });
      }

      res.json({
        userMessage,
        aiMessage,
        voiceAnalysis
      });

    } catch (error) {
      console.error("Error processing voice:", error);
      res.status(500).json({ error: "Failed to process voice message" });
    }
  });

  // Get voice analytics
  app.get("/api/voice-analytics", async (req, res) => {
    try {
      const profile = await storage.getVoiceProfile(1); // Default user
      const recentMessages = await storage.getRecentMessages(20);
      
      const userMessages = recentMessages.filter(msg => msg.isUser && msg.voiceAnalysis);
      const tones = userMessages.map(msg => msg.voiceAnalysis?.tone).filter(Boolean);
      const styles = userMessages.map(msg => msg.voiceAnalysis?.style).filter(Boolean);
      
      const analytics = {
        profile: profile?.speechPatterns || null,
        recentAnalysis: {
          totalMessages: userMessages.length,
          commonTones: [...new Set(tones)],
          commonStyles: [...new Set(styles)],
          averageConfidence: userMessages.reduce((sum, msg) => 
            sum + (msg.voiceAnalysis?.confidence || 0), 0) / userMessages.length || 0
        }
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
