import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Shield, Star, Users, Clock } from "lucide-react";

interface HeroProps {
  onCTAClick: () => void;
  onTryForFree: () => void;
}

export const Hero = ({ onCTAClick, onTryForFree }: HeroProps) => {
  const { user } = useAuth();

  return (
    <section className="hero-section relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Badge */}
          <div className="text-center mb-6">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5"
            >
              <Shield className="w-4 h-4 mr-2" />
              Trusted Legal AI Platform for India
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Trusted Legal
              </span>
              <br />
              AI Assistant
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, reliable legal guidance specialized in Indian law. No
              more expensive consultations, confusing legal jargon, or long
              waiting times. Professional legal help is now just a conversation
              away.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="text-center mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-4 gradient-primary text-white border-0 rounded-xl"
                onClick={onTryForFree}
              >
                Start Free Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-4 rounded-xl"
                onClick={
                  user
                    ? () => (window.location.href = "/dashboard")
                    : onCTAClick
                }
              >
                {user ? "Go to Dashboard" : "Sign In"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              ✓ Free to start • ✓ No credit card required • ✓ Available 24/7
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">10,000+</div>
              <div className="text-sm text-muted-foreground">Users Served</div>
            </div>

            <div className="text-center group">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">4.8/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>

            <div className="text-center group">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>

            <div className="text-center group">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">Secure</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
