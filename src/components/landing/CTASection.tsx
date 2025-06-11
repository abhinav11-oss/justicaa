
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onTryForFree: () => void;
}

export const CTASection = ({ onTryForFree }: CTASectionProps) => {
  const { user } = useAuth();

  return (
    <section className="gradient-primary py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h3 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of Indians who have simplified their legal needs with our AI-powered platform
        </p>
        
        <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 rounded-xl" onClick={onTryForFree}>
          {user ? "Go to Dashboard" : "Start Your Legal Journey"}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </section>
  );
};
