import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AppHeader from "@/components/app-header";
import ConversationArea from "@/components/conversation-area";
import VoiceRecordingPanel from "@/components/voice-recording-panel";
import QuickActions from "@/components/quick-actions";

export default function Home() {
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  // Fetch conversations
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["/api/conversations"],
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/conversations", { userId: null });
      return res.json();
    },
    onSuccess: (newConversation) => {
      setCurrentConversationId(newConversation.id);
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    }
  });

  // Process voice mutation
  const processVoiceMutation = useMutation({
    mutationFn: async ({ text, conversationId }: { text: string; conversationId: number }) => {
      const res = await apiRequest("POST", "/api/process-voice", { text, conversationId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (currentConversationId) {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/conversations", currentConversationId, "messages"] 
        });
      }
    }
  });

  // Initialize first conversation if none exists
  useEffect(() => {
    if (!isLoading && conversations.length === 0 && !currentConversationId) {
      createConversationMutation.mutate();
    } else if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, isLoading, currentConversationId]);

  const handleVoiceProcessed = async (transcription: string) => {
    if (!currentConversationId) {
      // Create new conversation if none exists
      const newConv = await createConversationMutation.mutateAsync();
      processVoiceMutation.mutate({ 
        text: transcription, 
        conversationId: newConv.id 
      });
    } else {
      processVoiceMutation.mutate({ 
        text: transcription, 
        conversationId: currentConversationId 
      });
    }
  };

  const currentConversation = conversations.find((conv: any) => conv.id === currentConversationId);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      
      {/* Demo Mode Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Your OpenAI quota has been exceeded. The app is running with simulated AI responses. 
              To get full AI analysis, please add credits to your OpenAI account or provide a new API key.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <ConversationArea 
          conversation={currentConversation}
          isLoading={isLoading}
        />
        
        <VoiceRecordingPanel 
          onVoiceProcessed={handleVoiceProcessed}
          isProcessing={processVoiceMutation.isPending}
        />
        
        <QuickActions conversationId={currentConversationId} />
      </div>

      {/* Privacy indicator */}
      <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg border border-gray-200 p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Secure</span>
        </div>
      </div>
    </div>
  );
}
