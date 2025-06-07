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
import { useAuth } from "@/hooks/useAuth";
import { Scale, MessageSquare, BookOpen, FileText, Shield, Users, User, LogIn, FilePlus } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [lawyerResultsOpen, setLawyerResultsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
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
    setSelectedService(service);
  };

  const handleContactLawyer = () => {
    setLawyerResultsOpen(true);
  };

  const handleStartChat = () => {
    setSelectedService(null);
    setActiveTab("chat");
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
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {legalServices.map((service, index) => (
              <Card 
                key={index} 
                className="bg-white/60 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
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
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-100">
                <TabsTrigger value="chat" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Chat</span>
                </TabsTrigger>
                <TabsTrigger value="generator" className="flex items-center space-x-2">
                  <FilePlus className="h-4 w-4" />
                  <span>Doc Generator</span>
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Legal Guides</span>
                </TabsTrigger>
                <TabsTrigger value="knowledge" className="flex items-center space-x-2">
                  <Scale className="h-4 w-4" />
                  <span>Knowledge Base</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Templates</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="chat">
                <ChatInterface />
              </TabsContent>
              <TabsContent value="generator">
                <DocumentGenerator />
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