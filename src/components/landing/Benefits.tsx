
import { Badge } from "@/components/ui/badge";
import { Clock, Shield, Gavel } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Free & Instant",
      description: "Get legal guidance instantly without waiting for appointments or paying consultation fees",
      stat: "24/7 Available"
    },
    {
      icon: Shield,
      title: "India-Specific",
      description: "Specialized in Indian laws including IPC, RTI, Consumer Protection, and more",
      stat: "100% Indian Law"
    },
    {
      icon: Gavel,
      title: "User-Friendly",
      description: "No legal jargon - just clear, understandable guidance for everyone",
      stat: "Plain Language"
    }
  ];

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-4">Built for Indian Legal System</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of legal assistance with our India-focused approach
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-10 w-10 text-white" />
              </div>
              <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
                {benefit.stat}
              </Badge>
              <h4 className="text-2xl font-semibold text-foreground mb-3">{benefit.title}</h4>
              <p className="text-muted-foreground text-base leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
