import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Benefits } from "@/components/landing/Benefits";
import { About } from "@/components/landing/About";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  // Listen for authentication messages from popup windows
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === window.location.origin &&
        event.data.type === "AUTH_SUCCESS"
      ) {
        // Redirect to dashboard instead of just reloading
        window.location.href = "/dashboard";
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
  }, [user]);

  const handleCTAClick = () => {
    if (user) {
      window.location.href = "/dashboard";
    } else {
      // Open auth in new tab
      const authWindow = window.open(
        "/auth",
        "_blank",
        "width=500,height=600,scrollbars=yes,resizable=yes",
      );

      // Listen for auth success message
      const messageHandler = (event: MessageEvent) => {
        if (
          event.origin === window.location.origin &&
          event.data.type === "AUTH_SUCCESS"
        ) {
          authWindow?.close();
          window.location.href = "/dashboard"; // Redirect to dashboard instead of reload
        }
      };

      window.addEventListener("message", messageHandler);

      // Cleanup listener if window is closed manually
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          window.removeEventListener("message", messageHandler);
          clearInterval(checkClosed);
        }
      }, 1000);
    }
  };

  const handleTryForFree = () => {
    if (user) {
      // If user is already logged in, go to dashboard
      window.location.href = "/dashboard";
    } else {
      // Navigate to dashboard with trial mode
      window.location.href = "/dashboard?trial=true";
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
