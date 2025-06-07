import { 
  users, 
  conversations, 
  messages, 
  voiceProfiles,
  type User, 
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type VoiceProfile,
  type InsertVoiceProfile
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Conversation methods
  getConversations(userId?: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: number): Promise<Conversation | undefined>;
  
  // Message methods
  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getRecentMessages(limit?: number): Promise<Message[]>;
  
  // Voice profile methods
  getVoiceProfile(userId: number): Promise<VoiceProfile | undefined>;
  createVoiceProfile(profile: InsertVoiceProfile): Promise<VoiceProfile>;
  updateVoiceProfile(userId: number, profile: Partial<InsertVoiceProfile>): Promise<VoiceProfile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private voiceProfiles: Map<number, VoiceProfile>;
  private currentUserId: number;
  private currentConversationId: number;
  private currentMessageId: number;
  private currentVoiceProfileId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.voiceProfiles = new Map();
    this.currentUserId = 1;
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentVoiceProfileId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getConversations(userId?: number): Promise<Conversation[]> {
    const allConversations = Array.from(this.conversations.values());
    if (userId) {
      return allConversations.filter(conv => conv.userId === userId);
    }
    return allConversations;
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = { 
      ...insertConversation, 
      id,
      timestamp: new Date()
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = {
      ...insertMessage,
      id,
      timestamp: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async getRecentMessages(limit: number = 10): Promise<Message[]> {
    return Array.from(this.messages.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getVoiceProfile(userId: number): Promise<VoiceProfile | undefined> {
    return Array.from(this.voiceProfiles.values()).find(profile => profile.userId === userId);
  }

  async createVoiceProfile(insertProfile: InsertVoiceProfile): Promise<VoiceProfile> {
    const id = this.currentVoiceProfileId++;
    const now = new Date();
    const profile: VoiceProfile = {
      ...insertProfile,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.voiceProfiles.set(id, profile);
    return profile;
  }

  async updateVoiceProfile(userId: number, updates: Partial<InsertVoiceProfile>): Promise<VoiceProfile | undefined> {
    const existing = await this.getVoiceProfile(userId);
    if (!existing) return undefined;

    const updated: VoiceProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.voiceProfiles.set(existing.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
