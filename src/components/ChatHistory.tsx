import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, MessageSquare, Pin, MoreHorizontal, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

interface ChatHistoryProps {
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  activeConversationId: string | null;
}

export const ChatHistory = ({ onSelectConversation, onNewConversation, activeConversationId }: ChatHistoryProps) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<Conversation[]>([]);
  const [pinned, setPinned] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user, activeConversationId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("id, title, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setHistory(data || []);
      setPinned([]);

    } catch (error: any) {
      toast({
        title: "Error fetching chat history",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card h-full flex flex-col border-r">
      <div className="p-4 space-y-4 border-b">
        <h2 className="text-xl font-bold">{t('chat.history')}</h2>
        <Button className="w-full" onClick={onNewConversation}>
          <Plus className="h-4 w-4 mr-2" />
          {t('chat.newChat')}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
              <Pin className="h-4 w-4 mr-2" /> {t('chat.pinned')}
            </h3>
            {pinned.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2">{t('chat.noPinned')}</p>
            ) : (
              <></>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t('chat.history')}</h3>
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2">{t('chat.historyEmpty')}</p>
            ) : (
              <div className="space-y-1">
                {history.map(conv => (
                  <Button
                    key={conv.id}
                    variant={activeConversationId === conv.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto py-2 text-left",
                      activeConversationId === conv.id && "bg-primary/10 text-primary"
                    )}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p className="text-sm font-medium truncate flex-1">{conv.title}</p>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};