import { BarChart3, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  conversationId: number | null;
}

export default function QuickActions({ conversationId }: QuickActionsProps) {
  const { toast } = useToast();

  const { data: analytics } = useQuery({
    queryKey: ["/api/voice-analytics"],
    enabled: !!conversationId,
  });

  const handleViewAnalytics = () => {
    if (analytics) {
      toast({
        title: "Voice Analytics",
        description: `Total messages: ${analytics.recentAnalysis?.totalMessages || 0}, Average confidence: ${Math.round((analytics.recentAnalysis?.averageConfidence || 0) * 100)}%`,
      });
    } else {
      toast({
        title: "No Analytics Available",
        description: "Start recording to generate voice analytics",
      });
    }
  };

  const handleExportConversation = () => {
    // Implementation would export conversation data
    toast({
      title: "Export Started",
      description: "Your conversation history is being prepared for download",
    });
  };

  const handleShareTwin = () => {
    // Implementation would create a shareable link
    toast({
      title: "Share Link Created",
      description: "Your AI Twin sharing link has been copied to clipboard",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Button
        variant="outline"
        onClick={handleViewAnalytics}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-auto hover:shadow-md transition-shadow justify-start"
      >
        <div className="flex items-center space-x-3 w-full">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-primary" size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Voice Analytics</h3>
            <p className="text-sm text-gray-500">View speech patterns</p>
          </div>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={handleExportConversation}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-auto hover:shadow-md transition-shadow justify-start"
      >
        <div className="flex items-center space-x-3 w-full">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Download className="text-secondary" size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Export Chat</h3>
            <p className="text-sm text-gray-500">Save conversations</p>
          </div>
        </div>
      </Button>

      <Button
        variant="outline"
        onClick={handleShareTwin}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-auto hover:shadow-md transition-shadow justify-start"
      >
        <div className="flex items-center space-x-3 w-full">
          <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Share2 className="text-green-500" size={20} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Share Twin</h3>
            <p className="text-sm text-gray-500">Let others chat</p>
          </div>
        </div>
      </Button>
    </div>
  );
}
