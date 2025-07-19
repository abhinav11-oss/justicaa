import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Star, Users, Clock, CheckCircle } from "lucide-react";

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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "circOut" },
    },
  };

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center text-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/justicaa.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-medium border-primary/30 bg-primary/10 text-primary backdrop-blur-sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              Your Trusted AI Legal Partner
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold text-foreground my-6 leading-tight"
          >
            Modern Legal Solutions, <br />
            <span className="text-primary">Intelligently Delivered</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Justicaa provides instant legal guidance, automated document
            creation, and access to a network of verified lawyers, all powered
            by cutting-edge AI.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full sm:w-auto"
              onClick={onTryForFree}
            >
              {user ? "Go to Dashboard" : "Get Started for Free"}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 rounded-xl w-full sm:w-auto"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};