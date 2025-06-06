
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      content: "Hello! I'm your Virtual Legal Assistant. I can help you with basic legal questions, guide you through legal processes, and provide general legal information. What legal question can I help you with today?",
      sender: 'assistant',
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickQuestions = [
    "How do I start a business?",
    "What's in a basic contract?",
    "Do I need a will?",
    "How to trademark a name?",
    "What are tenant rights?",
    "How to file for divorce?"
  ];

  const legalResponses = {
    "business": "To start a business, you'll typically need to: 1) Choose a business structure (LLC, Corporation, etc.), 2) Register your business name, 3) Get necessary licenses and permits, 4) Set up business banking, 5) Understand tax obligations. Would you like me to guide you through any of these steps in detail?",
    "contract": "A basic contract should include: 1) Parties involved, 2) Clear description of goods/services, 3) Payment terms, 4) Timeline/deadlines, 5) Termination clauses, 6) Dispute resolution process. Contracts should be written, signed, and each party should keep a copy.",
    "will": "A will is highly recommended for anyone with assets or dependents. It ensures your property is distributed according to your wishes and can name guardians for minor children. Basic wills can be simple, but complex estates may need professional help.",
    "trademark": "To trademark a name: 1) Search existing trademarks, 2) File application with USPTO, 3) Pay required fees, 4) Respond to any office actions, 5) Maintain the trademark. The process typically takes 8-12 months.",
    "tenant": "Tenant rights vary by state but generally include: right to habitable living conditions, privacy, reasonable notice for entry, return of security deposit, and protection from discrimination. Always check your local and state laws.",
    "divorce": "Divorce processes vary by state. Generally involves: 1) Filing petition, 2) Serving spouse, 3) Financial disclosure, 4) Negotiating terms (custody, property, support), 5) Court approval. Consider mediation for amicable divorces."
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateLegalResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date(),
        category: response.category
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateLegalResponse = (input: string): { content: string; category: string } => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('business') || lowerInput.includes('company') || lowerInput.includes('llc')) {
      return { content: legalResponses.business, category: 'business' };
    } else if (lowerInput.includes('contract') || lowerInput.includes('agreement')) {
      return { content: legalResponses.contract, category: 'contract' };
    } else if (lowerInput.includes('will') || lowerInput.includes('estate')) {
      return { content: legalResponses.will, category: 'estate' };
    } else if (lowerInput.includes('trademark') || lowerInput.includes('brand')) {
      return { content: legalResponses.trademark, category: 'ip' };
    } else if (lowerInput.includes('tenant') || lowerInput.includes('rent') || lowerInput.includes('landlord')) {
      return { content: legalResponses.tenant, category: 'housing' };
    } else if (lowerInput.includes('divorce') || lowerInput.includes('separation')) {
      return { content: legalResponses.divorce, category: 'family' };
    } else {
      return {
        content: "That's an interesting legal question. While I can provide general information, I'd recommend consulting with a qualified attorney for specific advice about your situation. In the meantime, you might find our Legal Guides or Knowledge Base helpful. Is there a specific area of law you'd like to explore?",
        category: 'general'
      };
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Quick Questions */}
      <div className="mb-4">
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
                    <p className="text-sm">{message.content}</p>
                    {message.category && message.sender === 'assistant' && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {message.category}
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
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
