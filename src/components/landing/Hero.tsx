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
  Sparkles,
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
    <section className="hero-section relative overflow-hidden min-h-screen flex items-center">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/3 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-background/90 to-background"></div>
      </div>

      {/* Animated Floating Elements */}
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

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-l from-primary/15 to-transparent rounded-full blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 lg:pr-8"
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

            {/* Main Heading with Rolling Animation */}
            <motion.div variants={itemVariants}>
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Justicaa: Your{" "}
                </motion.span>
                <motion.span
                  className="gradient-primary bg-clip-text text-transparent relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  AI Partner
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 blur-xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  {" "}
                  for Legal Help, Documents & Lawyers
                </motion.span>
              </motion.h1>
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
                  onClick={user ? () => onCTAClick() : onCTAClick}
                >
                  Try for free
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators with Rolling Animation */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8"
            >
              {[
                { icon: Users, number: "50K+", label: "Users" },
                { icon: Star, number: "4.8", label: "Rating" },
                { icon: Clock, number: "24/7", label: "Support" },
                { icon: Shield, number: "100%", label: "Secure" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                >
                  <motion.div
                    className="bg-primary/10 w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-2 relative overflow-hidden"
                    whileHover={{
                      backgroundColor: "hsl(var(--primary) / 0.2)",
                    }}
                  >
                    <stat.icon className="h-6 w-6 text-primary" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5,
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-lg font-semibold text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side Image with Animations */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main Image */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src="https://images.pexels.com/photos/8728289/pexels-photo-8728289.jpeg"
                    alt="Futuristic AI lawyer assistant with advanced legal technology"
                    className="w-full h-full object-cover"
                  />
                  {/* Enhanced Blue-themed Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-primary/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-background/10 to-background/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent"></div>

                  {/* Legal Tech Overlay Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/15 mix-blend-overlay"></div>
                </div>
              </motion.div>

              {/* Enhanced Floating Elements with Legal AI Theme */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500/40 to-primary/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.5, 0.9, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tl from-primary/30 to-blue-600/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />

              {/* Additional Legal Tech Elements */}
              <motion.div
                className="absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400/30 to-primary/15 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              />

              {/* Enhanced Legal AI Badge */}
              <motion.div
                className="absolute -top-4 -left-4 bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl px-4 py-3 shadow-2xl"
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.5, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.08, y: -2 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-full blur-sm"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Legal AI
                    </span>
                    <span className="text-xs text-primary font-medium">
                      Assistant
                    </span>
                  </div>
                </div>

                {/* Badge Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur-md -z-10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
