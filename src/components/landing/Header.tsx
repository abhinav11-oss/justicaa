import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Scale, ArrowRight, Menu, X } from "lucide-react";

interface HeaderProps {
  onCTAClick: () => void;
  onTryForFree: () => void;
}

export const Header = ({ onCTAClick, onTryForFree }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-md">
              <Scale className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Justicaa</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6 text-sm">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </nav>

            {user ? (
              <Link to="/dashboard">
                <Button>
                  Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={onCTAClick}>Sign in</Button>
                <Button onClick={onTryForFree}>Try for free</Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-card rounded-lg border">
            <nav className="flex flex-col space-y-4 text-center">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Features</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">About</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground">Contact</a>
              <div className="border-t pt-4 flex flex-col space-y-2">
                {user ? (
                  <Link to="/dashboard">
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Button variant="outline" onClick={onCTAClick} className="w-full">Sign in</Button>
                    <Button onClick={onTryForFree} className="w-full">Try for free</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
};