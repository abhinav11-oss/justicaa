import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Star,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";

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
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="hero-section relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-background via-background to-muted/30">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5 backdrop-blur-sm"
              >
                <Shield className="w-4 h-4 mr-2" />
                Trusted Legal AI Platform for India
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Justicaa: Your{" "}
                <span className="gradient-primary bg-clip-text text-transparent">
                  AI Partner
                </span>{" "}
                for Legal Help, Documents & Lawyers
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Say goodbye to expensive legal consultation, long waits for
                appointments, and confusing legal texts.
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div variants={itemVariants} className="space-y-3">
              {[
                "For consumers",
                "For lawyers",
                "24/7 AI assistance",
                "Indian law expertise",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center text-muted-foreground"
                >
                  <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 gradient-primary text-white border-0 rounded-xl"
                  onClick={onTryForFree}
                >
                  Try for free
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
            >
              {[
                { icon: Users, number: "50K+", label: "Users" },
                { icon: Star, number: "4.8", label: "Rating" },
                { icon: Clock, number: "24/7", label: "Support" },
                { icon: Shield, number: "100%", label: "Secure" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {stat.number}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="relative">
              {/* Main Interface Image */}
              <motion.div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://cdn.builder.io/api/v1/assets/63769d15090142bca58e9fb61656483f/image-3a7b3b?format=webp&width=800"
                  alt="AI Lawyer interface showing legal chat conversations"
                  className="w-full h-auto"
                />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -top-4 -right-4 bg-background border border-border rounded-full px-4 py-2 shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">
                    Product of the day
                  </span>
                </div>
              </motion.div>

              {/* Glowing Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 pointer-events-none" />
            </div>

            {/* Background Accent */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl blur-xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
