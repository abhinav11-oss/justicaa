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
    <div style={{ height: '100%', width: '100%', overflow: 'hidden', display: 'flex', position: 'relative' }}>
      {isMobile ? (
        <>
          {showHistory && (
            <div className="absolute inset-0 z-20 bg-card w-full overflow-hidden">
              {historyPanel}
            </div>
          )}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
            <Button 
              variant="outline" 
              size="sm" 
              className="m-2 w-fit flex-shrink-0"
              onClick={() => setShowHistory(!showHistory)}
            >
              <PanelLeftOpen className="h-4 w-4 mr-2" />
              {showHistory ? "Close History" : "View History"}
            </Button>
            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <ChatInterface 
                conversationId={conversationId}
                onSelectConversation={onSelectConversation}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ width: '25%', minWidth: 280, maxWidth: 350, height: '100%', overflow: 'hidden', flexShrink: 0 }}>
            {historyPanel}
          </div>
          <div style={{ flex: 1, minWidth: 0, height: '100%', overflow: 'hidden' }}>
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