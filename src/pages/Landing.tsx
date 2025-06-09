
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Scale, MessageSquare, FileText, Shield, Users, CheckCircle, ArrowRight, Gavel, BookOpen, Clock, Sun, Moon, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

const Landing = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Legal Chat",
      description: "Get instant answers to your legal questions with our advanced AI assistant"
    },
    {
      icon: FileText,
      title: "Document Generation",
      description: "Create professional legal documents in minutes with guided templates"
    },
    {
      icon: Users,
      title: "Find Legal Experts",
      description: "Connect with qualified lawyers near you based on your specific needs"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Free & Instant",
      description: "Get legal guidance instantly without waiting for appointments or paying consultation fees"
    },
    {
      icon: Shield,
      title: "Geo-Personalized",
      description: "Location-specific legal advice and local lawyer recommendations"
    },
    {
      icon: Gavel,
      title: "User-Friendly",
      description: "No legal jargon - just clear, understandable guidance for everyone"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Ask",
      description: "Submit your legal question or select a document type"
    },
    {
      step: "2",
      title: "Get Answer",
      description: "Receive instant AI-powered legal guidance and recommendations"
    },
    {
      step: "3",
      title: "Generate/Contact",
      description: "Download documents or connect with local legal experts"
    }
  ];

  const handleCTAClick = () => {
    if (user) {
      // Already signed in, redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      // Not signed in, show auth modal
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <Scale className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Justicaa</h1>
                <p className="text-sm text-muted-foreground">Your AI Partner for Legal Help, Documents & Lawyers.</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {user ? (
                <Link to="/dashboard">
                  <Button>
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button onClick={handleCTAClick}>
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <div className="flex flex-col space-y-2 pt-4">
                {user ? (
                  <Link to="/dashboard">
                    <Button className="w-full">
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button onClick={handleCTAClick} className="w-full">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Powered by Advanced AI Technology
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your Virtual Legal Assistant
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Simplifying Legal Solutions for Everyone
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant legal guidance, generate professional documents, and connect with qualified lawyers - all in one intelligent platform designed for the modern world.
          </p>
          
          <Button size="lg" className="text-lg px-8 py-4" onClick={handleCTAClick}>
            {user ? "Access Your Dashboard" : "Start Your Legal Journey"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">What We Do</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive legal assistance through multiple integrated services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-3">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Choose LegalAI Assistant?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of legal assistance with our innovative approach to legal services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">{benefit.title}</h4>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">How It Works</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started with legal assistance in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.step}
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-2">{step.title}</h4>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-border transform translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have simplified their legal needs with our AI-powered platform
          </p>
          
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={handleCTAClick}>
            {user ? "Go to Dashboard" : "Create Free Account"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary p-2 rounded-lg">
                  <Scale className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">LegalAI Assistant</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Empowering everyone with accessible legal solutions
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Company</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Legal</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Legal Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <div className="text-sm text-muted-foreground">
              <strong>Legal Disclaimer:</strong> This platform provides general legal information only and is not a substitute for professional legal advice. 
              For specific legal matters, please consult with a qualified attorney.
            </div>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Landing;
