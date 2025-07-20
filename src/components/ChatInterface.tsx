import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Bot, User, Loader2, Copy, Lock, Volume2, Paperclip, Sparkles, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { QuickQuestions } from "@/components/QuickQuestions";
import { VoiceChat, useSpeakText } from "@/components/VoiceChat";
import { Switch } from "@/components/ui/switch";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  conversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export const ChatInterface = ({ conversationId: propConversationId, onSelectConversation }: ChatInterfaceProps) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(propConversationId);
  const [trialMessagesUsed, setTrialMessagesUsed] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { speakText, isSpeaking } = useSpeakText();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isTrialMode = !user && (window.location.search.includes('trial=true') || localStorage.getItem('trialMode') === 'true');
  const TRIAL_MESSAGE_LIMIT = 3;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isTrialMode) {
      localStorage.setItem('trialMode', 'true');
      const savedCount = localStorage.getItem('trialMessagesUsed');
      setTrialMessagesUsed(savedCount ? parseInt(savedCount) : 0);
    }
  }, [isTrialMode]);

  useEffect(() => {
    if (propConversationId && !isLoading) {
      setConversationId(propConversationId);
      fetchMessages(propConversationId);
      setShowPrompts(false);
    } else if (!propConversationId) {
      setMessages([]);
      setConversationId(null);
      setShowPrompts(true);
    }
  }, [propConversationId]);

  const fetchMessages = async (convId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }));
      setMessages(loadedMessages);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "Could not fetch previous messages.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    setInputValue(question);
    handleSendMessage(question);
  };

  const handleTranscript = (transcript: string) => {
    setInputValue(transcript);
    handleSendMessage(transcript);
  };

  const handleAuthAction = () => {
    const authWindow = window.open('/auth', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
    const messageHandler = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data.type === 'AUTH_SUCCESS') {
        authWindow?.close();
        setShowAuthModal(false);
        localStorage.removeItem('trialMode');
        localStorage.removeItem('trialMessagesUsed');
        window.location.href = '/dashboard';
      }
    };
    window.addEventListener('message', messageHandler);
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
    setShowPrompts(false);

    if (isTrialMode) {
      const newCount = trialMessagesUsed + 1;
      setTrialMessagesUsed(newCount);
      localStorage.setItem('trialMessagesUsed', newCount.toString());
    }

    try {
      let currentConvId = conversationId;

      if (!currentConvId && user) {
        const { data: conversation, error: convError } = await supabase
          .from("chat_conversations")
          .insert([{ user_id: user.id, title: content.slice(0, 50) + "...", status: "active" }])
          .select()
          .single();

        if (convError) throw convError;
        setConversationId(conversation.id);
        currentConvId = conversation.id;
        onSelectConversation(conversation.id);
      }

      const { data, error } = await supabase.functions.invoke('ai-legal-chat-hf', {
        body: { message: content, conversation_id: currentConvId, category: "general" }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "I apologize, but I couldn't process your request.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (user && currentConvId) {
        await supabase.from("chat_messages").insert([
          { conversation_id: currentConvId, sender: "user", content: content, created_at: userMessage.timestamp.toISOString() },
          { conversation_id: currentConvId, sender: "assistant", content: assistantMessage.content, created_at: assistantMessage.timestamp.toISOString() }
        ]);
      }

      if (isTrialMode && trialMessagesUsed + 1 >= TRIAL_MESSAGE_LIMIT) {
        setTimeout(() => setShowAuthModal(true), 2000);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      toast({ title: t('common.error'), description: "Failed to send message.", variant: "destructive" });
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting right now.",
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
      toast({ title: t('common.copied'), description: "Message copied to clipboard" });
    } catch (error) {
      toast({ title: t('common.error'), description: "Failed to copy message", variant: "destructive" });
    }
  };

  const handleSpeakMessage = (text: string) => {
    speakText(text);
  };

  const isInputDisabled = isTrialMode && trialMessagesUsed >= TRIAL_MESSAGE_LIMIT;

  const WelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="bg-card p-8 rounded-lg max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          {t('chat.helloUser', { name: user?.user_metadata?.full_name || "there" })}
        </h2>
        <p className="text-muted-foreground">
          {t('chat.welcome')}
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      <Card className="flex-1 flex flex-col rounded-none border-0 h-full">
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
            <div className="px-3 md:px-6">
              {messages.length === 0 && !isLoading ? (
                showPrompts ? (
                  <QuickQuestions onQuestionClick={handleQuestionClick} />
                ) : (
                  <WelcomeScreen />
                )
              ) : null}
              
              {messages.length > 0 && (
                <div className="space-y-3 md:space-y-4 py-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex items-start space-x-2 md:space-x-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      {message.role === "assistant" && <div className="bg-primary p-1.5 md:p-2 rounded-full flex-shrink-0"><Bot className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" /></div>}
                      <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-lg ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                          <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <div className="flex items-center space-x-1">
                            {message.role === "assistant" && <Button variant="ghost" size="sm" onClick={() => handleSpeakMessage(message.content)} className="h-5 w-5 md:h-6 md:w-6 p-0 opacity-70 hover:opacity-100" disabled={isSpeaking}><Volume2 className="h-3 w-3" /></Button>}
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(message.content)} className="h-5 w-5 md:h-6 md:w-6 p-0 opacity-70 hover:opacity-100"><Copy className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      </div>
                      {message.role === "user" && <div className="bg-primary p-1.5 md:p-2 rounded-full flex-shrink-0"><User className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" /></div>}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <div className="bg-primary p-1.5 md:p-2 rounded-full"><Bot className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" /></div>
                      <div className="bg-muted p-3 md:p-4 rounded-lg"><div className="flex items-center space-x-2"><Loader2 className="h-3 w-3 md:h-4 w-4 animate-spin" /><span className="text-sm">{t('chat.thinking')}</span></div></div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-3 md:p-4 flex-shrink-0 border-t bg-card">
            <div className="relative">
              <Button variant="ghost" size="icon" className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"><Paperclip className="h-5 w-5" /></Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isInputDisabled ? t('auth.signInContinue') : t('chat.placeholder')}
                disabled={isLoading || isInputDisabled}
                className="flex-1 text-sm md:text-base pl-10 pr-12"
              />
              <Button onClick={() => handleSendMessage()} disabled={isLoading || !inputValue.trim() || isInputDisabled} size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isInputDisabled ? <Lock className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                <VoiceChat
                  onTranscript={handleTranscript}
                  isListening={isListening}
                  onListeningChange={setIsListening}
                />
                <div className="flex items-center gap-2">
                  <Switch id="internet-mode" onCheckedChange={(checked) => toast({ title: `Internet access ${checked ? 'enabled' : 'disabled'}. This is a demo feature.`})} />
                  <Label htmlFor="internet-mode" className="text-sm text-muted-foreground">Internet</Label>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowPrompts(!showPrompts)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Prompts
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center hidden md:block">
                {t('chat.disclaimer')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-[425px] mx-4">
          <DialogHeader>
            <DialogTitle>{t('auth.signInContinue')}</DialogTitle>
            <DialogDescription>{t('auth.trialComplete')}</DialogDescription>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{t('auth.benefits')}</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>{t('auth.aiLegalChat')}</li>
              <li>{t('auth.documentGeneration')}</li>
              <li>{t('auth.legalGuides')}</li>
              <li>{t('auth.lawyerFinder')}</li>
            </ul>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAuthModal(false)}>{t('common.cancel')}</Button>
            <Button className="gradient-primary text-white border-0" onClick={handleAuthAction}>{t('auth.signUp')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};