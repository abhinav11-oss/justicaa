import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onCTAClick: () => void;
  onTryForFree: () => void;
}

export const Hero = ({ onCTAClick, onTryForFree }: HeroProps) => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center pt-20">
      {/* Background Grid */}
      <div className="absolute inset-0 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Intelligent Legal Guidance for Modern India
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Justicaa combines AI precision with legal expertise to provide instant answers, generate documents, and connect you with verified lawyers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" onClick={onTryForFree}>
                {user ? "Go to Dashboard" : "Get Started for Free"}
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
      </div>
    </section>
  );
};