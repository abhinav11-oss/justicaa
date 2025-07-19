import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Shield, Clock, CheckCircle, Star } from "lucide-react";

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
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't Let Legal Issues Overwhelm You
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get the legal help you need, when you need it. Join over 50,000
            Indians who trust Justicaa for their legal guidance. Start with a
            free consultation today.
          </p>

          {/* Benefits */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-12 text-white/90">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center"
              >
                <benefit.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              className="text-lg px-8 py-3 bg-white text-primary hover:bg-white/90 rounded-lg w-full sm:w-auto shadow-lg"
              onClick={onTryForFree}
            >
              {user ? "Go to Dashboard" : "Start Free Consultation"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-lg w-full sm:w-auto shadow-lg"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-white/80 text-sm space-y-2">
            <p>
              Trusted by 50,000+ users • Available 24/7 • Free to start
            </p>
            <div className="flex items-center justify-center space-x-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p>4.8/5 rating from verified users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};