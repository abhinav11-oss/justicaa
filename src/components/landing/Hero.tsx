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
import { BackgroundBeams } from "@/components/BackgroundBeams";

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
        staggerChildren: 0.1, // Slightly reduced stagger
        delayChildren: 0.2, // Slightly reduced delay
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Reduced y translation
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }, // Reduced duration
    },
  };

  const floatingVariants = {
    float: {
      y: [-5, 5, -5], // Reduced float range
      transition: {
        duration: 5, // Reduced duration
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

      {/* Add BackgroundBeams here */}
      <BackgroundBeams className="absolute inset-0 z-0" />

      {/* Animated Floating Elements (simplified) */}
      <motion.div
        className="absolute top-20 left-10 w-16 h-16 border border-primary/20 rounded-full"
        variants={floatingVariants}
        animate="float"
      />
      <motion.div
        className="absolute top-40 right-20 w-12 h-12 border border-primary/30 rounded-full"
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-40 left-1/4 w-8 h-8 border border-primary/25 rounded-full"
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 1 }}
      />

      {/* Animated Gradient Orbs (simplified) */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-xl"
        animate={{
          scale: [1, 1.1, 1], // Reduced scale
          opacity: [0.2, 0.4, 0.2], // Reduced opacity range
        }}
        transition={{
          duration: 6, // Reduced duration
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-gradient-to-l from-primary/15 to-transparent rounded-full blur-lg"
        animate={{
          scale: [1, 1.2, 1], // Reduced scale
          opacity: [0.1, 0.3, 0.1], // Reduced opacity range
        }}
        transition={{
          duration: 5, // Reduced duration
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto"> {/* Changed to lg:grid-cols-2 */}
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 lg:pr-8 text-center lg:text-left" /* Re-added lg:text-left */
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start"> {/* Re-added lg:justify-start */}
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
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 30 }} // Simplified animation
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Justicaa: Your{" "}
                </motion.span>
                <motion.span
                  className="gradient-primary bg-clip-text text-transparent relative"
                  initial={{ opacity: 0, y: 20 }} // Simplified animation
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  AI Partner
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
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
            <motion.div variants={itemVariants} className="space-y-3 flex flex-col items-center lg:items-start"> {/* Re-added lg:items-start */}
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
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start"> {/* Re-added lg:justify-start */}
              <motion.div
                whileHover={{ scale: 1.03 }} // Slightly reduced hover scale
                whileTap={{ scale: 0.97 }} // Slightly reduced tap scale
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

            {/* Trust Indicators */}
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
                  initial={{ opacity: 0, y: 20 }} // Simplified animation
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }} // Removed rotateY
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
                      animate={{ x: [-50, 50] }} // Reduced x range
                      transition={{
                        duration: 1.5, // Reduced duration
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3, // Reduced delay
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-lg font-semibold text-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
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

          {/* Right Content - AI Lawyer Image */}
          <motion.div
            variants={itemVariants}
            className="relative flex justify-center items-center h-96 lg:h-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.3 }}
          >
            <img
              src="/images/justicaa.jpeg"
              alt="AI Legal Assistant"
              className="rounded-3xl shadow-2xl object-cover w-full h-full max-w-md lg:max-w-none"
              style={{ aspectRatio: '3/4' }}
            />
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 30, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};