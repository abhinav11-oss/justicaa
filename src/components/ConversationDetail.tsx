import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Download, Archive, MessageSquare, Bot, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: string;
  created_at: string;
  metadata?: any;
}

interface ConversationDetailProps {
  conversationId: string;
  onBack: () => void;
}

export function ConversationDetail({ conversationId, onBack }: ConversationDetailProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversationDetails();
  }, [conversationId]);

  const fetchConversationDetails = async () => {
    try {
      // Fetch conversation details
      const { data: conversationData, error: convError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Fetch messages
      const { data: messagesData, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      setConversation(conversationData);
      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error fetching conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // Create a simple text export (in a real app, you'd use a PDF library)
    const content = messages.map(msg => 
      `[${new Date(msg.created_at).toLocaleString()}] ${msg.sender}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation_${conversationId}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Conversation exported successfully"
    });
  };

  const archiveConversation = async () => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ status: 'archived' })
        .eq('id', conversationId);

      if (error) throw error;

      toast({
        title: "Conversation Archived",
        description: "This conversation has been archived"
      });
      
      onBack();
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast({
        title: "Error",
        description: "Failed to archive conversation",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Conversation not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}> {/* Removed border class */}
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{conversation.title}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="capitalize"> {/* Removed border class */}
                {conversation.legal_category}
              </Badge>
              <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                {conversation.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(conversation.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportToPDF}> {/* Removed border class */}
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={archiveConversation}> {/* Removed border class */}
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        </div>
      </div>

      {/* Messages */}
      <Card> {/* Removed border class */}
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Conversation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No messages in this conversation</p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex space-x-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' ? 'bg-primary' : 'bg-muted-foreground'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-4 w-4 text-primary-foreground" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        )}
                      </div>
                      <Card className={`${
                        message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
                      }`}> {/* Removed border class */}
                        <CardContent className="p-3">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.metadata?.category && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {message.metadata.category.replace('-', ' ')}
                            </Badge>
                          )}
                          <p className="text-xs opacity-70 mt-2">
                            {new Date(message.created_at).toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Continue Chat Button */}
      {conversation.status === 'active' && (
        <Card className="bg-primary/5"> {/* Removed border class */}
          <CardContent className="pt-6 text-center">
            <p className="text-primary mb-4">Want to continue this conversation?</p>
            <Button className="bg-primary hover:bg-primary/90">
              <MessageSquare className="h-4 w-4 mr-2" />
              Continue Chat
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}