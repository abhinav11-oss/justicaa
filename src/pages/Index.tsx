import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/ChatInterface";
import { LegalGuides } from "@/components/LegalGuides";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { DocumentTemplates } from "@/components/DocumentTemplates";
import { DocumentGenerator } from "@/components/DocumentGenerator";
import { AuthModal } from "@/components/AuthModal";
import { UserDashboard } from "@/components/UserDashboard";
import { LawyerResults } from "@/components/LawyerResults";
import { LegalServiceDetail } from "@/components/LegalServiceDetail";
import { LawyerFinder } from "@/components/LawyerFinder";
import { useAuth } from "@/hooks/useAuth";
import { Scale, MessageSquare, BookOpen, FileText, Shield, Users, User, LogIn, FilePlus, Lock } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [lawyerResultsOpen, setLawyerResultsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { user, loading } = useAuth();

  const legalServices = [
    {
      id: "business",
      icon: Scale,
      title: "Business Law",
      description: "Formation, contracts, compliance guidance",
      badge: "Popular"
    },
    {
      id: "personal",
      icon: Shield,
      title: "Personal Legal",
      description: "Estate planning, family law, personal injury",
      badge: "Essential"
    },
    {
      id: "contract",
      icon: FileText,
      title: "Contract Review",
      description: "Employment, rental, service agreements",
      badge: "Quick"
    },
    {
      id: "process",
      icon: Users,
      title: "Legal Process",
      description: "Step-by-step guidance through procedures",
      badge: "Guided"
    }
  ];

  const handleServiceClick = (service: any) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedService(service);
    setSelectedCategory(service.id);
  };

  const handleContactLawyer = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setLawyerResultsOpen(true);
  };

  const handleStartChat = () => {
    setSelectedService(null);
    setActiveTab("chat");
  };

  const handleTabChange = (value: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setActiveTab(value);
  };

  const handleFeatureClick = (feature: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // Handle feature-specific logic
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show dashboard if user is logged in
  if (user) {
    return <UserDashboard />;
  }

  // Show service detail if a service is selected
  if (selectedService) {
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
                <Button variant="outline" size="sm" onClick={() => setAuthModalOpen(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
                <Button variant="outline" size="sm" onClick={handleContactLawyer}>
                  <Lock className="h-4 w-4 mr-2" />
                  Contact Lawyer
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <LegalServiceDetail 
            service={selectedService} 
            onBack={() => setSelectedService(null)}
            onStartChat={handleStartChat}
          />
        </div>
      </div>
    );
  }

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
              <Button variant="outline" size="sm" onClick={() => setAuthModalOpen(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button variant="outline" size="sm" onClick={handleContactLawyer}>
                <Lock className="h-4 w-4 mr-2" />
                Contact Lawyer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Get Legal Guidance <span className="text-blue-600">Instantly</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Our AI-powered legal assistant provides immediate answers to common legal questions, 
            generates legal documents, and helps you find qualified lawyers near you.
          </p>
          
          {/* Authentication Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Lock className="h-5 w-5 text-amber-600" />
              <p className="text-amber-800 font-medium">
                Sign in required to access AI Chat, Find Lawyers, Generate Documents, and Template Downloads
              </p>
            </div>
          </div>
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {legalServices.map((service, index) => (
              <Card 
                key={index} 
                className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer relative"
                onClick={() => handleServiceClick(service)}
              >
                {!user && (
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-lg flex items-center justify-center">
                    <Lock className="h-8 w-8 text-slate-600" />
                  </div>
                )}
                <CardHeader className="text-center pb-3">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    {service.badge}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Interface */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl relative">
          {!user && (
            <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] rounded-lg z-10 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-700 font-medium mb-4">Authentication Required</p>
                <Button onClick={() => setAuthModalOpen(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In to Access Features
                </Button>
              </div>
            </div>
          )}
          
          <CardHeader>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-100">
                <TabsTrigger value="chat" className="flex items-center space-x-2" disabled={!user}>
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Chat</span>
                  {!user && <Lock className="h-3 w-3" />}
                </TabsTrigger>
                <TabsTrigger value="generator" className="flex items-center space-x-2" disabled={!user}>
                  <FilePlus className="h-4 w-4" />
                  <span>Doc Generator</span>
                  {!user && <Lock className="h-3 w-3" />}
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex items-center space-x-2" disabled={!user}>
                  <BookOpen className="h-4 w-4" />
                  <span>Legal Guides</span>
                  {!user && <Lock className="h-3 w-3" />}
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="flex items-center space-x-2" disabled={!user}>
                  <Scale className="h-4 w-4" />
                  <span>Knowledge Base</span>
                  {!user && <Lock className="h-3 w-3" />}
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center space-x-2" disabled={!user}>
                  <FileText className="h-4 w-4" />
                  <span>Templates</span>
                  {!user && <Lock className="h-3 w-3" />}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="chat">
                <ChatInterface category={selectedCategory} />
              </TabsContent>
              <TabsContent value="generator">
                <DocumentGenerator category={selectedCategory} />
              </TabsContent>
              <TabsContent value="guides">
                <LegalGuides />
              </TabsContent>
              <TabsContent value="knowledge">
                <KnowledgeBase />
              </TabsContent>
              <TabsContent value="templates">
                <DocumentTemplates />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">
                <strong>Legal Disclaimer:</strong> This AI assistant provides general legal information only and is not a substitute for professional legal advice. 
                For specific legal matters, please consult with a qualified attorney. We do not endorse any specific lawyers in our directory.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      {lawyerResultsOpen && (
        <LawyerResults onClose={() => setLawyerResultsOpen(false)} />
      )}
    </div>
  );
};

export default Index;