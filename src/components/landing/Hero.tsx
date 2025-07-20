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
      <section className="relative text-center lg:text-left py-24 md:py-32 lg:py-40">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tighter">
                Your AI Partner for Legal Help in India
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10">
                From filing RTIs to understanding your rights, Justicaa simplifies law with intelligent chat and auto-generated legal documents.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" onClick={onTryForFree} className="gradient-primary w-full sm:w-auto">
                    {user ? "Go to Dashboard" : "Get Started Free"}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" onClick={onCTAClick} className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <img 
                src="/images/hero-image.jpg" 
                alt="Justicaa Dashboard on Laptop and Mobile" 
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </div>

          <motion.div 
            className="mt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <p className="text-sm text-muted-foreground mb-6 tracking-widest text-center">
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