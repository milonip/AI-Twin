import { MessageCircle, Trash2, Play, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  voiceAnalysis?: {
    tone: string;
    style: string;
    confidence: number;
    sentiment: string;
    energy: string;
  };
}

interface Conversation {
  id: number;
  messages: Message[];
  timestamp: Date;
}

interface ConversationAreaProps {
  conversation?: Conversation;
  isLoading: boolean;
}

export default function ConversationArea({ conversation, isLoading }: ConversationAreaProps) {
  const messages = conversation?.messages || [];

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getConfidenceColor = (analysis: any) => {
    if (!analysis) return "bg-gray-400";
    const confidence = analysis.confidence || 0;
    if (confidence > 0.8) return "bg-green-500";
    if (confidence > 0.6) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const handleClearConversation = () => {
    // Implementation would clear conversation history
    console.log("Clear conversation");
  };

  const handlePlayAudio = (messageId: number, isAI: boolean) => {
    // Implementation would play audio for the message
    console.log(`Play audio for message ${messageId}, AI: ${isAI}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Loading conversation...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 min-h-[400px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <MessageCircle className="text-white" size={16} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Conversation with your AI Twin</h2>
            <p className="text-sm text-gray-500">
              {conversation ? `Last active: ${formatTime(conversation.timestamp)}` : "Start a new conversation"}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleClearConversation}
          className="text-gray-400 hover:text-gray-600"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ maxHeight: "500px" }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
              <p>Start recording to begin your conversation with your AI Twin</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser 
                  ? "bg-gray-200" 
                  : "bg-gradient-to-r from-primary to-secondary"
              }`}>
                {message.isUser ? (
                  <User className="text-gray-600" size={14} />
                ) : (
                  <Bot className="text-white" size={14} />
                )}
              </div>
              <div className="flex-1">
                <div className={`rounded-2xl px-4 py-3 max-w-xs ${
                  message.isUser
                    ? "bg-gray-100 rounded-tl-md"
                    : "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-tl-md"
                }`}>
                  <p className="text-gray-900 text-sm">{message.text}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePlayAudio(message.id, !message.isUser)}
                    className="text-xs h-auto p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Play size={12} className="mr-1" />
                    {message.isUser ? "Original" : "AI Voice"}
                  </Button>
                  {message.isUser && message.voiceAnalysis && (
                    <div className="flex items-center space-x-1">
                      <div className={`w-1 h-1 rounded-full ${getConfidenceColor(message.voiceAnalysis)}`}></div>
                      <span className="text-xs text-gray-400">
                        {message.voiceAnalysis.tone} tone detected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
