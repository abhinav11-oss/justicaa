
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Scale, MessageSquare, FileText, Shield, Users, CheckCircle, ArrowRight, Gavel, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

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
    },
    {
      icon: BookOpen,
      title: "Legal Research",
      description: "Access comprehensive legal guides and educational resources"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Get legal guidance instantly without waiting for appointments"
    },
    {
      icon: Shield,
      title: "Cost-Effective",
      description: "Access legal information and basic services at a fraction of traditional costs"
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
      title: "Sign Up",
      description: "Create your free account in seconds"
    },
    {
      step: "2",
      title: "Choose Service",
      description: "Select from AI chat, document generation, or lawyer finder"
    },
    {
      step: "3",
      title: "Get Results",
      description: "Receive instant legal guidance and solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">LegalAI Assistant</h1>
                <p className="text-sm text-slate-600">Your Virtual Legal Counsel</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {user ? (
                <Link to="/dashboard">
                  <Button>
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button onClick={() => setAuthModalOpen(true)}>
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Powered by Advanced AI Technology
          </Badge>
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Your Virtual Legal Assistant
          </h2>
          <p className="text-xl text-slate-600 mb-4">
            Simplifying Legal Solutions for Everyone
          </p>
          <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
            Get instant legal guidance, generate professional documents, and connect with qualified lawyers - all in one intelligent platform designed for the modern world.
          </p>
          
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-8 py-4">
                Access Your Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="text-lg px-8 py-4" onClick={() => setAuthModalOpen(true)}>
              Start Your Legal Journey
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </section>

      {/* What We Do Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">What We Do</h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive legal assistance through multiple integrated services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center pb-3">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="h-6 w-6 text-blue-600" />
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
      <section className="bg-white/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Why Choose LegalAI Assistant?</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the future of legal assistance with our innovative approach to legal services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">{benefit.title}</h4>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started with legal assistance in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.step}
              </div>
              <h4 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h4>
              <p className="text-slate-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-blue-200 transform translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have simplified their legal needs with our AI-powered platform
          </p>
          
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => setAuthModalOpen(true)}>
              Create Free Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">LegalAI Assistant</span>
          </div>
          <p className="text-slate-400 mb-4">
            Empowering everyone with accessible legal solutions
          </p>
          <div className="text-sm text-slate-500">
            <strong>Legal Disclaimer:</strong> This platform provides general legal information only and is not a substitute for professional legal advice. 
            For specific legal matters, please consult with a qualified attorney.
          </div>
        </div>
      </footer>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default Landing;
