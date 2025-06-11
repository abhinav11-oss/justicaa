
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileText, Users } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Legal Chat",
      description: "Get instant answers to your legal questions with our advanced AI assistant specialized in Indian law",
      highlight: "Instant Answers"
    },
    {
      icon: FileText,
      title: "Document Generation",
      description: "Create professional legal documents in minutes with guided templates for Indian legal procedures",
      highlight: "Smart Templates"
    },
    {
      icon: Users,
      title: "Find Legal Experts",
      description: "Connect with qualified lawyers near you based on your specific legal needs and location",
      highlight: "Expert Network"
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">Features</Badge>
        <h3 className="text-4xl font-bold text-foreground mb-4">Comprehensive Legal Solutions</h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered platform provides end-to-end legal assistance tailored for Indian citizens
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="card-hover border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">
                {feature.highlight}
              </Badge>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-base">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
