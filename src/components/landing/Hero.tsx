import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AnimatedGridBackground } from "@/components/AnimatedGridBackground";

interface HeroProps {
  onCTAClick: () => void;
  onTryForFree: () => void;
}

export const Hero = ({ onCTAClick, onTryForFree }: HeroProps) => {
  const { user } = useAuth();

  return (
    <AnimatedGridBackground>
      <section className="relative text-center py-32 lg:py-40">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tighter">
              AI-Powered Legal Solutions for Modern Businesses
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Draft contracts, get legal advice, and manage compliance effortlessly with our intelligent legal platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" onClick={onTryForFree} className="gradient-primary">
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" onClick={onCTAClick}>
                  Sign In
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-6 tracking-widest">
              TRUSTED BY LEADING COMPANIES IN INDIA
            </p>
            <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-70">
              <span className="text-muted-foreground font-semibold text-xl">Startup Inc.</span>
              <span className="text-muted-foreground font-semibold text-xl">Innovate Corp</span>
              <span className="text-muted-foreground font-semibold text-xl">Tech Solutions</span>
              <span className="text-muted-foreground font-semibold text-xl">Growth Co.</span>
              <span className="text-muted-foreground font-semibold text-xl">Future Ventures</span>
            </div>
          </motion.div>
        </div>
      </section>
    </AnimatedGridBackground>
  );
};