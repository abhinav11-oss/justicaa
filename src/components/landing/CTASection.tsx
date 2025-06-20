import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Shield, Clock, CheckCircle } from "lucide-react";

interface CTASectionProps {
  onTryForFree: () => void;
}

export const CTASection = ({ onTryForFree }: CTASectionProps) => {
  const { user } = useAuth();

  const benefits = [
    { icon: Clock, text: "Get answers in seconds, not weeks" },
    { icon: Shield, text: "100% confidential and secure" },
    { icon: CheckCircle, text: "No legal jargon, just clear guidance" },
  ];

  return (
    <section className="gradient-primary py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't Let Legal Issues Overwhelm You
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get the legal help you need, when you need it. Join over 50,000
            Indians who trust Justicaa for their legal guidance. Start with a
            free consultation today.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-white/90"
              >
                <benefit.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 rounded-xl w-full sm:w-auto"
              onClick={onTryForFree}
            >
              {user ? "Go to Dashboard" : "Start Free Consultation"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 text-white border-white/30 hover:bg-white/10 rounded-xl w-full sm:w-auto"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-white/80 text-sm">
            <p className="mb-2">
              Trusted by 50,000+ users • Available 24/7 • Free to start
            </p>
            <p>⭐⭐⭐⭐⭐ 4.8/5 rating from verified users</p>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 border border-white/20 rounded-full"></div>
      </div>
    </section>
  );
};
