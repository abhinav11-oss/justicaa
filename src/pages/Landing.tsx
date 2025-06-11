import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Scale, MessageSquare, FileText, Shield, Users, CheckCircle, ArrowRight, Gavel, BookOpen, Clock, Sun, Moon, Menu, X, Star, Zap, Award, Phone, Mail } from "lucide-react";
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
      description: "Get instant answers to your legal questions with our advanced AI assistant specialized in Indian law",
      highlight: "Instant Answers"
    },
    {
      icon: FileText,
      title: "Document Generation",
      description: "Create professional legal documents in minutes with guided templates for Indian legal procedures",
      highlight: "Smart Templates"
    },
    {
      icon: Users,
      title: "Find Legal Experts",
      description: "Connect with qualified lawyers near you based on your specific legal needs and location",
      highlight: "Expert Network"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Free & Instant",
      description: "Get legal guidance instantly without waiting for appointments or paying consultation fees",
      stat: "24/7 Available"
    },
    {
      icon: Shield,
      title: "India-Specific",
      description: "Specialized in Indian laws including IPC, RTI, Consumer Protection, and more",
      stat: "100% Indian Law"
    },
    {
      icon: Gavel,
      title: "User-Friendly",
      description: "No legal jargon - just clear, understandable guidance for everyone",
      stat: "Plain Language"
    }
  ];

  const handleCTAClick = () => {
    if (user) {
      window.location.href = "/dashboard";
    } else {
      // Open auth in new tab
      const authWindow = window.open('/auth', '_blank', 'width=500,height=600,scrollbars=yes,resizable=yes');
      
      // Listen for auth success message
      const messageHandler = (event) => {
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
    // Navigate to dashboard for trial mode
    window.location.href = "/dashboard?trial=true";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="gradient-primary p-2 rounded-xl">
                <Scale className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Justicaa</h1>
                <p className="text-sm text-muted-foreground">Your AI Legal Assistant</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex items-center space-x-6">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </nav>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {user ? (
                <Link to="/dashboard">
                  <Button className="gradient-primary text-white border-0">
                    Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleCTAClick}>
                    Sign in
                  </Button>
                  <Button className="gradient-primary text-white border-0" onClick={handleTryForFree}>
                    Try for free
                  </Button>
                </>
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
              <div className="flex flex-col space-y-4 pt-4">
                <nav className="flex flex-col space-y-2">
                  <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                  <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
                  <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
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
                    <Button variant="outline" onClick={handleCTAClick} className="w-full">
                      Sign in
                    </Button>
                    <Button onClick={handleTryForFree} className="w-full gradient-primary text-white border-0">
                      Try for free
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              AI Lawyer: your personal legal AI assistant
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Say goodbye to expensive legal consultation, long waits for appointments, and confusing legal texts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 gradient-primary text-white border-0 rounded-xl" 
                onClick={handleTryForFree}
              >
                Try for free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-xl" 
                onClick={handleCTAClick}
              >
                {user ? "Go to Dashboard" : "Sign In"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-4">Comprehensive Legal Solutions</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides end-to-end legal assistance tailored for Indian citizens
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">
                  {feature.highlight}
                </Badge>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
            <h3 className="text-4xl font-bold text-foreground mb-4">Built for Indian Legal System</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of legal assistance with our India-focused approach
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-10 w-10 text-white" />
                </div>
                <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary">
                  {benefit.stat}
                </Badge>
                <h4 className="text-2xl font-semibold text-foreground mb-3">{benefit.title}</h4>
                <p className="text-muted-foreground text-base leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">About Us</Badge>
          <h3 className="text-4xl font-bold text-foreground mb-4">Meet Team Ctrl+Alt+Elite</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate developers revolutionizing legal accessibility through AI technology
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="card-hover border-2 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Scale className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl mb-2">Justicaa</CardTitle>
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                AI Legal Platform
              </Badge>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Justicaa is an innovative AI-powered legal assistance platform designed specifically for the Indian legal system. 
                Our mission is to democratize legal knowledge and make quality legal guidance accessible to every Indian citizen.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Our Team</h4>
                  <p className="text-sm text-muted-foreground">Ctrl+Alt+Elite</p>
                </div>
                
                <div className="text-center">
                  <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Gavel className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Focus</h4>
                  <p className="text-sm text-muted-foreground">Indian Legal System</p>
                </div>
                
                <div className="text-center">
                  <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Mission</h4>
                  <p className="text-sm text-muted-foreground">Accessible Legal AI</p>
                </div>
              </div>
              
              <div className="border-t border-border pt-6 mt-8">
                <p className="text-muted-foreground">
                  We believe that legal knowledge should not be a privilege of the few, but a right accessible to all. 
                  Through cutting-edge AI technology and deep understanding of Indian laws, we're building a platform 
                  that empowers citizens with instant, accurate, and affordable legal guidance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h3 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of Indians who have simplified their legal needs with our AI-powered platform
          </p>
          
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90 rounded-xl" onClick={handleTryForFree}>
            {user ? "Go to Dashboard" : "Start Your Legal Journey"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="gradient-primary p-2 rounded-xl">
                  <Scale className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-foreground">Justicaa</span>
              </div>
              <p className="text-muted-foreground mb-4 text-base">
                Empowering every Indian with accessible legal solutions through AI technology
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Company</h5>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Contact Us</h5>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+918269704727" className="hover:text-foreground transition-colors">+91 8269704727</a>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:abhinavlodhi99@gmail.com" className="hover:text-foreground transition-colors">abhinavlodhi99@gmail.com</a>
                </li>
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
