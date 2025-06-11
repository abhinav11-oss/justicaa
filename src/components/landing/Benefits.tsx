
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
    <section className="bg-muted/30 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
          <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-3 md:mb-4 px-4">Built for Indian Legal System</h3>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Experience the future of legal assistance with our India-focused approach
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="gradient-primary w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary text-xs">
                {benefit.stat}
              </Badge>
              <h4 className="text-xl md:text-2xl font-semibold text-foreground mb-2 md:mb-3">{benefit.title}</h4>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed px-4">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
