import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();

  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0.8)"],
  );

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", updateScrolled);
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <motion.header
      className={`backdrop-blur-md border-b border-border/50 sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/90 shadow-lg" : "bg-background/60"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="gradient-primary p-2 rounded-xl">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Justicaa</h1>
              <p className="text-sm text-muted-foreground">
                Your AI Legal Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </nav>

            {user ? (
              <Link to="/dashboard">
                <Button className="gradient-primary text-white border-0">
                  Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="ghost" onClick={onCTAClick}>
                  Sign in
                </Button>
                <Button
                  className="gradient-primary text-white border-0"
                  onClick={onTryForFree}
                >
                  Try for free
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <div className="flex flex-col space-y-4 pt-4">
              <nav className="flex flex-col space-y-2">
                <a
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
                <a
                  href="#contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </nav>
              {user ? (
                <Link to="/dashboard">
                  <Button className="w-full gradient-primary text-white border-0">
                    Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={onCTAClick}
                    className="w-full"
                  >
                    Sign in
                  </Button>
                  <Button
                    onClick={onTryForFree}
                    className="w-full gradient-primary text-white border-0"
                  >
                    Try for free
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};
