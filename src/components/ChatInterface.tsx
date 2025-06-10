
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Copy, MessageSquare, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { QuickQuestions } from "@/components/QuickQuestions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  category?: string;
}

export const ChatInterface = ({ category }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [trialMessagesUsed, setTrialMessagesUsed] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasUserInteracted = messages.some(msg => msg.role === "user");

  // Check if this is trial mode
  const isTrialMode = !user && window.location.search.includes('trial=true');
  const TRIAL_MESSAGE_LIMIT = 3;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load trial messages count from localStorage
  useEffect(() => {
    if (isTrialMode) {
      const savedCount = localStorage.getItem('trialMessagesUsed');
      setTrialMessagesUsed(savedCount ? parseInt(savedCount) : 0);
    }
  }, [isTrialMode]);

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
    handleSendMessage(question);
  };

  const handleAuthAction = () => {
    // Open auth in new tab
    const authWindow = window.open('/auth', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
    
    // Listen for auth success message
    const messageHandler = (event) => {
      if (event.origin === window.location.origin && event.data.type === 'AUTH_SUCCESS') {
        authWindow?.close();
        setShowAuthModal(false);
        window.location.reload(); // Refresh to update auth state
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    // Cleanup listener if window is closed manually
    const checkClosed = setInterval(() => {
      if (authWindow?.closed) {
        window.removeEventListener('message', messageHandler);
        clearInterval(checkClosed);
      }
    }, 1000);
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content) return;

    // Check trial limit for non-authenticated users
    if (isTrialMode && trialMessagesUsed >= TRIAL_MESSAGE_LIMIT) {
      setShowAuthModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Update trial message count
    if (isTrialMode) {
      const newCount = trialMessagesUsed + 1;
      setTrialMessagesUsed(newCount);
      localStorage.setItem('trialMessagesUsed', newCount.toString());
    }

    try {
      // Create conversation if not exists
      if (!conversationId && user) {
        const { data: conversation, error: convError } = await supabase
          .from("chat_conversations")
          .insert([
            {
              user_id: user.id,
              title: content.slice(0, 50) + "...",
              legal_category: category || "general",
              status: "active"
            }
          ])
          .select()
          .single();

        if (convError) throw convError;
        setConversationId(conversation.id);
      }

      // Call the free Hugging Face AI function
      const { data, error } = await supabase.functions.invoke('ai-legal-chat-hf', {
        body: {
          message: content,
          conversation_id: conversationId,
          category: category || "general"
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I apologize, but I couldn't process your request at the moment. Please try again or consider consulting with a qualified attorney for immediate assistance.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save messages to database if user is logged in
      if (user && conversationId) {
        // Insert user message
        await supabase.from("chat_messages").insert({
          conversation_id: conversationId,
          sender: "user",
          content: content,
          created_at: userMessage.timestamp.toISOString()
        });

        // Insert assistant message
        await supabase.from("chat_messages").insert({
          conversation_id: conversationId,
          sender: "assistant",
          content: assistantMessage.content,
          created_at: assistantMessage.timestamp.toISOString()
        });
      }

      // Show auth modal if trial limit reached
      if (isTrialMode && trialMessagesUsed + 1 >= TRIAL_MESSAGE_LIMIT) {
        setTimeout(() => setShowAuthModal(true), 2000);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now. As an alternative, consider reaching out to local legal aid organizations or consulting with an attorney for immediate assistance.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Message copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive"
      });
    }
  };

  const isInputDisabled = isTrialMode && trialMessagesUsed >= TRIAL_MESSAGE_LIMIT;

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                AI Legal Assistant
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Get instant legal guidance and answers to your questions
              </p>
            </div>
            {isTrialMode && (
              <Badge variant="outline" className="capitalize">
                Trial Mode: {TRIAL_MESSAGE_LIMIT - trialMessagesUsed}/{TRIAL_MESSAGE_LIMIT} messages left
              </Badge>
            )}
            {category && (
              <Badge variant="outline" className="capitalize">
                {category}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
            <div className="px-6">
              {!hasUserInteracted && (
                <QuickQuestions 
                  onQuestionClick={handleQuestionClick}
                  isVisible={!hasUserInteracted}
                />
              )}
              
              {messages.length > 0 && (
                <div className="space-y-4 py-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="bg-primary p-2 rounded-full">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content)}
                            className="h-6 px-2 opacity-70 hover:opacity-100"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="bg-primary p-2 rounded-full">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary p-2 rounded-full">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t p-4 flex-shrink-0">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isInputDisabled ? "Please sign in to continue" : "Ask me anything about legal matters..."}
                disabled={isLoading || isInputDisabled}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim() || isInputDisabled}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isInputDisabled ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This AI assistant provides general legal information only. Consult a qualified lawyer for specific legal advice.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Auth Dialog */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              You've used all your free trial messages. Sign in or create an account to continue using the AI Legal Assistant.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Creating an account gives you unlimited access to:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>AI legal chat</li>
              <li>Document generation</li>
              <li>Legal guide repository</li>
              <li>Lawyer finder</li>
            </ul>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAuthModal(false)}>Cancel</Button>
            <Button className="gradient-primary text-white border-0" onClick={handleAuthAction}>
              Sign in / Sign up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
