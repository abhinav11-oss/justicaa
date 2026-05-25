import { useState, useEffect } from "react";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInterface } from "@/components/ChatInterface";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { PanelLeftOpen } from "lucide-react";

interface ChatViewProps {
  conversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export const ChatView = ({ conversationId, onSelectConversation, onNewConversation }: ChatViewProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    if (isMobile) setShowHistory(false);
  };

  const handleNew = () => {
    onNewConversation();
    if (isMobile) setShowHistory(false);
  };

  useEffect(() => {
    if (!user) {
      onNewConversation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const historyPanel = (
    <ChatHistory 
      onSelectConversation={handleSelect}
      onNewConversation={handleNew}
      activeConversationId={conversationId}
    />
  );

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden">
      {isMobile ? (
        <>
          {showHistory && (
            <div className="absolute inset-0 z-20 bg-card w-full overflow-hidden">
              {historyPanel}
            </div>
          )}
          <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
            <Button 
              variant="outline" 
              size="sm" 
              className="m-2 w-fit flex-shrink-0"
              onClick={() => setShowHistory(!showHistory)}
            >
              <PanelLeftOpen className="h-4 w-4 mr-2" />
              {showHistory ? "Close History" : "View History"}
            </Button>
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatInterface 
                conversationId={conversationId}
                onSelectConversation={onSelectConversation}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-1/4 min-w-[280px] max-w-[350px] h-full min-h-0 overflow-hidden flex-shrink-0">
            {historyPanel}
          </div>
          <div className="flex-1 h-full min-h-0 min-w-0 overflow-hidden">
            <ChatInterface 
              conversationId={conversationId}
              onSelectConversation={onSelectConversation}
            />
          </div>
        </>
      )}
    </div>
  );
};