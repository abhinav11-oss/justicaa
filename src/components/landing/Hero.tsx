import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Star, Users, Clock } from "lucide-react";

interface HeroProps {
  onCTAClick: () => void;
  onTryForFree: () => void;
}

export const Hero = ({ onCTAClick, onTryForFree }: HeroProps) => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="hero-section relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/6077797/pexels-photo-6077797.jpeg"
          alt="Golden justice scales on a desk beside a laptop"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border border-primary/20 rounded-full"
        variants={floatingVariants}
        animate="float"
      />
      <motion.div
        className="absolute top-40 right-20 w-16 h-16 border border-primary/30 rounded-full"
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute bottom-40 left-1/4 w-12 h-12 border border-primary/25 rounded-full"
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 2 }}
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Badge */}
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5 backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              Trusted Legal AI Platform for India
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your <span className="gradient-primary bg-clip-text text-transparent">Trusted Legal</span><br />
              AI Assistant
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, reliable legal guidance specialized in Indian law. No more expensive consultations,
              confusing legal jargon, or long waiting times. Professional legal help is now just a conversation away.
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
                onClick={user ? () => window.location.href = "/dashboard" : onCTAClick}
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