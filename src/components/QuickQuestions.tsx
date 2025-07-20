import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, Users, Scale, Home, BookOpen, Building } from "lucide-react";

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const quickQuestions = [
  {
    icon: Scale,
    question: "What is bail and how do I apply for it?",
    category: "Criminal Law"
  },
  {
    icon: FileText,
    question: "How to file an FIR online?",
    category: "Criminal Law"
  },
  {
    icon: Users,
    question: "What are my rights during police questioning?",
    category: "Rights"
  },
  {
    icon: Home,
    question: "How do I register a property?",
    category: "Property Law"
  },
  {
    icon: Users,
    question: "What documents are needed for divorce?",
    category: "Family Law"
  },
  {
    icon: Scale,
    question: "How to file a consumer complaint?",
    category: "Consumer Law"
  },
  {
    icon: BookOpen,
    question: "How do I file an RTI application?",
    category: "Public Rights"
  },
  {
    icon: Building,
    question: "What are the steps to start a company?",
    category: "Business Law"
  }
];

export const QuickQuestions = ({ onQuestionClick }: QuickQuestionsProps) => {
  return (
    <div className="space-y-4 p-4">
      <div className="text-center">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary/60" />
        <h3 className="text-lg font-semibold text-foreground mb-2">How can I help you today?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose a quick question or type your own legal query
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quickQuestions.map((item, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 text-left justify-start hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
            onClick={() => onQuestionClick(item.question)}
          >
            <div className="flex items-start space-x-3 w-full">
              <item.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {item.question}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.category}
                </p>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};