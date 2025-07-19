import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, CheckCircle } from "lucide-react";

interface CTASectionProps {
  onTryForFree: () => void;
}

export const CTASection = ({ onTryForFree }: CTASectionProps) => {
  const { user } = useAuth();

  const benefits = [
    "Instant AI Legal Advice",
    "Document Generation",
    "Verified Lawyer Network",
    "100% Confidential",
  ];

  return (
    <section className="bg-card border-t py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to Simplify Your Legal Needs?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Join thousands of users who trust Justicaa for fast, affordable, and reliable legal assistance. Get started today.
          </p>

          <div className="flex justify-center mb-10">
            <Button
              size="lg"
              className="text-lg px-8 py-3 gradient-primary text-white border-0 shadow-lg"
              onClick={onTryForFree}
            >
              {user ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-muted-foreground">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};