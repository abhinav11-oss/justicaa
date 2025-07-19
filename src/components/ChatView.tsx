import { useState, useEffect } from "react";
import { ChatHistory } from "@/components/ChatHistory";
import { ChatInterface } from "@/components/ChatInterface";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { PanelLeftOpen } from "lucide-react";

export const ChatView = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    if (isMobile) setShowHistory(false);
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    if (isMobile) setShowHistory(false);
  };

  useEffect(() => {
    if (!user) {
      setActiveConversationId(null);
    }
  }, [user]);

  const historyPanel = (
    <ChatHistory 
      onSelectConversation={handleSelectConversation}
      onNewConversation={handleNewConversation}
      activeConversationId={activeConversationId}
    />
  );

  return (
    <div className="flex h-full w-full">
      {isMobile ? (
        <>
          {showHistory && (
            <div className="absolute inset-0 z-20 bg-card w-full">
              {historyPanel}
            </div>
          )}
          <div className="flex-1 flex flex-col">
            <Button 
              variant="outline" 
              size="sm" 
              className="m-2 w-fit"
              onClick={() => setShowHistory(!showHistory)}
            >
              <PanelLeftOpen className="h-4 w-4 mr-2" />
              {showHistory ? "Close History" : "View History"}
            </Button>
            <div className="flex-1">
              <ChatInterface 
                key={activeConversationId}
                conversationId={activeConversationId}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-1/4 min-w-[280px] max-w-[350px]">
            {historyPanel}
          </div>
          <div className="flex-1">
            <ChatInterface 
              key={activeConversationId}
              conversationId={activeConversationId}
            />
          </div>
        </>
      )}
    </div>
  );
};