import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Benefits } from "@/components/landing/Benefits";
import { About } from "@/components/landing/About";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleCTAClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      // Navigate to auth page in same window
      navigate("/auth");
    }
  };

  const handleTryForFree = () => {
    if (user) {
      // If user is already logged in, go to dashboard
      navigate("/dashboard");
    } else {
      // Navigate to dashboard with trial mode
      navigate("/dashboard?trial=true");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onCTAClick={handleCTAClick} onTryForFree={handleTryForFree} />
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <motion.div variants={fadeInUp}>
          <Hero onCTAClick={handleCTAClick} onTryForFree={handleTryForFree} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Features />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Benefits />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <About />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Testimonials />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <CTASection onTryForFree={handleTryForFree} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Footer />
        </motion.div>
      </motion.div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default Landing;
