import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, User, Bot, Lightbulb, Settings, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LawyerFinder } from "./LawyerFinder";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  category?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI-powered Virtual Legal Assistant. I can help you with legal questions, guide you through legal processes, provide general legal information, and help you find lawyers near you. What legal question can I help you with today?",
      sender: 'assistant',
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openai' | 'huggingface'>('huggingface');
  const [showLawyerFinder, setShowLawyerFinder] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const quickQuestions = [
    "How do I start a business?",
    "What's in a basic contract?",
    "Do I need a will?",
    "How to trademark a name?",
    "What are tenant rights?",
    "How to file for divorce?"
  ];

  const detectLawType = (text: string): string => {
    const content = text.toLowerCase();
    
    // Criminal Law
    if (content.includes('fir') || content.includes('police') || content.includes('arrest') || 
        content.includes('bail') || content.includes('criminal') || content.includes('theft') ||
        content.includes('fraud') || content.includes('ipc') || content.includes('crpc')) {
      return 'criminal';
    }
    
    // Family Law
    if (content.includes('divorce') || content.includes('marriage') || content.includes('custody') ||
        content.includes('alimony') || content.includes('adoption') || content.includes('family')) {
      return 'family';
    }
    
    // Property Law
    if (content.includes('property') || content.includes('land') || content.includes('rent') ||
        content.includes('landlord') || content.includes('tenant') || content.includes('real estate') ||
        content.includes('registration') || content.includes('stamp duty')) {
      return 'property';
    }
    
    // Business/Corporate Law
    if (content.includes('business') || content.includes('company') || content.includes('llc') ||
        content.includes('corporation') || content.includes('partnership') || content.includes('gst') ||
        content.includes('tax') || content.includes('startup')) {
      return 'business';
    }
    
    // Contract Law
    if (content.includes('contract') || content.includes('agreement') || content.includes('nda') ||
        content.includes('terms') || content.includes('clause') || content.includes('breach')) {
      return 'contract';
    }
    
    // Consumer Law
    if (content.includes('consumer') || content.includes('refund') || content.includes('complaint') ||
        content.includes('defective') || content.includes('warranty') || content.includes('service')) {
      return 'consumer';
    }
    
    // Employment Law
    if (content.includes('employment') || content.includes('job') || content.includes('workplace') ||
        content.includes('salary') || content.includes('termination') || content.includes('pf') ||
        content.includes('esi') || content.includes('labour')) {
      return 'employment';
    }
    
    // Intellectual Property
    if (content.includes('trademark') || content.includes('copyright') || content.includes('patent') ||
        content.includes('intellectual property') || content.includes('brand')) {
      return 'intellectual-property';
    }
    
    return 'general';
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Detect law type from user input
    const detectedCategory = detectLawType(inputValue);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      category: detectedCategory
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      console.log(`Sending message to AI (${aiProvider}):`, inputValue);
      
      // Get conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10);
      
      const functionName = aiProvider === 'openai' ? 'ai-legal-chat' : 'ai-legal-chat-hf';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          message: inputValue,
          conversationHistory: conversationHistory,
          detectedCategory: detectedCategory
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('AI response received:', data);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(),
        category: data.category || detectedCategory
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save conversation to database if user is logged in
      if (user) {
        try {
          await saveConversationToDatabase([userMessage, assistantMessage]);
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          // Don't block the UI for database errors
        }
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or consider consulting with a qualified attorney for immediate legal assistance.",
        sender: 'assistant',
        timestamp: new Date(),
        category: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const saveConversationToDatabase = async (newMessages: Message[]) => {
    if (!user) return;

    try {
      // Create or get conversation
      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: messages.length === 1 ? inputValue.slice(0, 50) + '...' : undefined,
          legal_category: newMessages.find(m => m.category)?.category
        })
        .select()
        .single();

      if (convError && convError.code !== '23505') { // Ignore duplicate key errors
        throw convError;
      }

      // Save messages
      if (conversation) {
        const messagesToSave = newMessages.map(msg => ({
          conversation_id: conversation.id,
          content: msg.content,
          sender: msg.sender,
          metadata: { category: msg.category }
        }));

        const { error: msgError } = await supabase
          .from('chat_messages')
          .insert(messagesToSave);

        if (msgError) {
          throw msgError;
        }
      }
    } catch (error) {
      console.error('Database save error:', error);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  if (showLawyerFinder) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Find Lawyers Near You</h3>
          <Button variant="outline" onClick={() => setShowLawyerFinder(false)}>
            Back to Chat
          </Button>
        </div>
        <LawyerFinder />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* AI Provider Selection */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2" />
            Quick Questions
          </h3>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLawyerFinder(true)}
              className="text-xs bg-blue-50 hover:bg-blue-100"
            >
              <MapPin className="h-3 w-3 mr-1" />
              Find Lawyers Near Me
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-slate-500" />
          <Select value={aiProvider} onValueChange={(value: 'openai' | 'huggingface') => setAiProvider(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="huggingface">
                <div className="flex flex-col">
                  <span>Hugging Face</span>
                  <span className="text-xs text-green-600">Free</span>
                </div>
              </SelectItem>
              <SelectItem value="openai">
                <div className="flex flex-col">
                  <span>OpenAI</span>
                  <span className="text-xs text-blue-600">Premium</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 border rounded-lg bg-slate-50" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-slate-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <Card className={`${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.category && message.sender === 'assistant' && message.category !== 'greeting' && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {message.category.replace('-', ' ')}
                      </Badge>
                    )}
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-600">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <Card className="bg-white">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex space-x-2 mt-4">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask your legal question..."
          onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
          className="flex-1"
          disabled={isTyping}
        />
        <Button 
          onClick={handleSendMessage} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isTyping || !inputValue.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* User status indicator */}
      {!user && (
        <p className="text-xs text-slate-500 mt-2 text-center">
          Sign in to save your chat history and access personalized features
        </p>
      )}
      
      {/* AI Provider info */}
      <p className="text-xs text-slate-500 mt-1 text-center">
        Using {aiProvider === 'huggingface' ? 'Hugging Face (Free)' : 'OpenAI (Premium)'} • 
        {aiProvider === 'huggingface' ? ' Limited daily usage' : ' Requires API key'}
      </p>
    </div>
  );
};
