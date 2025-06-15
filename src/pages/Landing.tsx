
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Benefits } from "@/components/landing/Benefits";
import { About } from "@/components/landing/About";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Landing = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  // Listen for authentication messages from popup windows
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data.type === 'AUTH_SUCCESS') {
        // Refresh the page to update auth state
        window.location.reload();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCTAClick = () => {
    if (user) {
      window.location.href = "/dashboard";
    } else {
      // Open auth in new tab
      const authWindow = window.open('/auth', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      // Listen for auth success message
      const messageHandler = (event: MessageEvent) => {
        if (event.origin === window.location.origin && event.data.type === 'AUTH_SUCCESS') {
          authWindow?.close();
          window.location.reload(); // Refresh to update auth state
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Cleanup listener if window is closed manually
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          window.removeEventListener('message', messageHandler);
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header onCTAClick={handleCTAClick} onTryForFree={handleTryForFree} />
      <Hero onCTAClick={handleCTAClick} onTryForFree={handleTryForFree} />
      <Features />
      <Benefits />
      <About />
      <CTASection onTryForFree={handleTryForFree} />
      <Footer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Landing;
