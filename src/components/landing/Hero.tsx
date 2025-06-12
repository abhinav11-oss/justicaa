import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onCTAClick: () => void;
  onTryForFree: () => void;
}

export const Hero = ({ onCTAClick, onTryForFree }: HeroProps) => {
  const { user } = useAuth();

  return (
    <section className="hero-section relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
            AI Lawyer: your personal legal AI assistant
          </h2>
          
          <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Say goodbye to expensive legal consultation, long waits for appointments, and confusing legal texts.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12 px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-3 md:py-4 gradient-primary text-white border-0 rounded-xl" 
              onClick={onTryForFree}
            >
              Try for free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl" 
              onClick={user ? () => window.location.href = "/dashboard" : onCTAClick}
            >
              {user ? "Go to Dashboard" : "Sign In"}
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};