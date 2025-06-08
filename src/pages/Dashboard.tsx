
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { LegalGuides } from "@/components/LegalGuides";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { DocumentTemplates } from "@/components/DocumentTemplates";
import { DocumentGenerator } from "@/components/DocumentGenerator";
import { LawyerFinder } from "@/components/LawyerFinder";
import { UserDashboard } from "@/components/UserDashboard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useAuth } from "@/hooks/useAuth";
import { 
  Scale, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Shield, 
  Users, 
  User, 
  LogOut, 
  FilePlus,
  Home,
  Settings,
  Search
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('lastTab') || "home";
  });
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    sessionStorage.setItem('lastTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const saveScrollPosition = () => {
      sessionStorage.setItem('scrollY', window.scrollY.toString());
    };

    window.addEventListener('scroll', saveScrollPosition);
    return () => window.removeEventListener('scroll', saveScrollPosition);
  }, []);

  useEffect(() => {
    if (user) {
      const savedScrollY = sessionStorage.getItem('scrollY');
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY));
      }
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const sidebarItems = [
    {
      id: "home",
      title: "Home",
      icon: Home,
      description: "Dashboard overview"
    },
    {
      id: "chat",
      title: "AI Chat",
      icon: MessageSquare,
      description: "Legal assistance chat"
    },
    {
      id: "lawyers",
      title: "Find Lawyers",
      icon: Users,
      description: "Locate legal experts"
    },
    {
      id: "generator",
      title: "Document Generator",
      icon: FilePlus,
      description: "Create legal documents"
    },
    {
      id: "templates",
      title: "Templates",
      icon: FileText,
      description: "Document templates"
    },
    {
      id: "guides",
      title: "Legal Guides",
      icon: BookOpen,
      description: "Educational resources"
    },
    {
      id: "research",
      title: "Legal Research",
      icon: Search,
      description: "Case law and statutes"
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      description: "App preferences"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "home":
        return user ? <UserDashboard /> : <DashboardHome />;
      case "chat":
        return <ChatInterface category="all" />;
      case "lawyers":
        return <LawyerFinder category="all" />;
      case "generator":
        return <DocumentGenerator category="all" />;
      case "templates":
        return <DocumentTemplates />;
      case "guides":
        return <LegalGuides />;
      case "research":
        return <KnowledgeBase />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex">
      {/* Vertical Sidebar */}
      <aside className="w-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-r border-slate-200 dark:border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">LegalAI Assistant</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Gwalior's Legal Solution</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  activeTab === item.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Signed in</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Browse as guest</p>
              <Button variant="outline" size="sm" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                {sidebarItems.find(item => item.id === activeTab)?.title || "Dashboard"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {sidebarItems.find(item => item.id === activeTab)?.description || "Welcome to your legal assistant"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setActiveTab("settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = () => {
  const quickActions = [
    {
      title: "Start AI Chat",
      description: "Get instant legal guidance",
      icon: MessageSquare,
      action: "chat",
      color: "bg-blue-500"
    },
    {
      title: "Generate Document",
      description: "Create legal documents",
      icon: FilePlus,
      action: "generator",
      color: "bg-green-500"
    },
    {
      title: "Find Gwalior Lawyer",
      description: "Connect with local legal experts",
      icon: Users,
      action: "lawyers",
      color: "bg-purple-500"
    },
    {
      title: "Browse Guides",
      description: "Learn about legal topics",
      icon: BookOpen,
      action: "guides",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-2">Welcome to LegalAI Assistant</h3>
          <p className="text-blue-100">
            Your comprehensive platform for legal assistance in Gwalior - document generation, local lawyer connections, and expert guidance.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{action.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Gwalior Legal Services</h4>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>• Connect with verified lawyers in Gwalior</p>
              <p>• Access Madhya Pradesh legal templates</p>
              <p>• Get location-specific legal guidance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Tips</h4>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>• Use specific legal terms for better AI responses</p>
              <p>• Save important documents to your profile</p>
              <p>• Enable location access for local lawyer suggestions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
