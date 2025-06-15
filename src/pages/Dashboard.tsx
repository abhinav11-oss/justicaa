
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/ChatInterface";
import { LegalGuides } from "@/components/LegalGuides";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { DocumentTemplates } from "@/components/DocumentTemplates";
import { DocumentGenerator } from "@/components/DocumentGenerator";
import { LawyerFinder } from "@/components/LawyerFinder";
import { UserDashboard } from "@/components/UserDashboard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Scale, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Users, 
  User, 
  LogOut, 
  FilePlus,
  Home,
  Settings,
  Search,
  Sun,
  Moon,
  AlertTriangle,
  Menu,
  X,
  Plus,
  Bell,
  Mail
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('lastTab') || "home";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut, loading, sessionError } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check if this is trial mode
  const isTrialMode = !user && (window.location.search.includes('trial=true') || localStorage.getItem('trialMode') === 'true');

  // Handle trial mode initialization
  useEffect(() => {
    if (isTrialMode) {
      localStorage.setItem('trialMode', 'true');
      if (!user) {
        setActiveTab("chat");
      }
    }
  }, [isTrialMode, user]);

  // Redirect to landing if not authenticated and not in trial mode
  useEffect(() => {
    if (!loading && !user && !isTrialMode) {
      navigate("/");
    }
  }, [user, loading, navigate, isTrialMode]);

  useEffect(() => {
    sessionStorage.setItem('lastTab', activeTab);
  }, [activeTab]);

  // Show session error notification
  useEffect(() => {
    if (sessionError) {
      toast({
        title: "Session Error",
        description: sessionError,
        variant: "destructive",
        duration: 5000
      });
    }
  }, [sessionError, toast]);

  const handleSignOut = async () => {
    try {
      setActiveTab("home");
      await signOut();
      
      sessionStorage.clear();
      localStorage.removeItem('lastTab');
      localStorage.removeItem('trialMode');
      localStorage.removeItem('trialMessagesUsed');
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
      
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: "Logout Error",
        description: "There was an issue signing out. Redirecting anyway.",
        variant: "destructive"
      });
      
      navigate("/");
    }
  };

  const sidebarItems = [
    // Show home tab only for authenticated users
    ...(user ? [{
      id: "home",
      title: "Dashboard",
      icon: Home,
      description: "Overview"
    }] : []),
    {
      id: "chat",
      title: "AI Chat",
      icon: MessageSquare,
      description: "Legal Assistant"
    },
    // Show other tabs only for authenticated users
    ...(user ? [
      {
        id: "lawyers",
        title: "Lawyers",
        icon: Users,
        description: "Find Experts"
      },
      {
        id: "generator",
        title: "Documents",
        icon: FilePlus,
        description: "Generate"
      },
      {
        id: "templates",
        title: "Templates",
        icon: FileText,
        description: "Legal Forms"
      },
      {
        id: "guides",
        title: "Guides",
        icon: BookOpen,
        description: "Legal Info"
      },
      {
        id: "research",
        title: "Research",
        icon: Search,
        description: "Case Law"
      },
      {
        id: "settings",
        title: "Settings",
        icon: Settings,
        description: "Account"
      }
    ] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
          {sessionError && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-md">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <p className="text-sm text-amber-800">{sessionError}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Don't render dashboard if user is not authenticated and not in trial mode
  if (!user && !isTrialMode) {
    return null;
  }

  const renderMainContent = () => {
    // For trial users, only show chat interface
    if (isTrialMode && !user) {
      return <ChatInterface category="all" />;
    }

    // For authenticated users, show all features
    switch (activeTab) {
      case "home":
        return <UserDashboard />;
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
        return user ? <UserDashboard /> : <ChatInterface category="all" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        bg-gray-900 text-white
        ${isMobile ? 'w-72 h-full z-50' : 'w-72'} 
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl">
              <Scale className="h-6 w-6 text-gray-900" />
            </div>
            <span className="text-xl font-semibold">Justicaa</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center space-x-3 text-left ${
                  activeTab === item.id
                    ? "bg-white text-gray-900"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-white text-gray-900">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400">Premium User</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : isTrialMode ? (
            <div className="space-y-3">
              <div className="p-3 bg-blue-900/50 rounded-lg border border-blue-800">
                <p className="text-sm font-medium text-blue-200">Free Trial</p>
                <p className="text-xs text-blue-300">Limited access</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/auth'}
                className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </div>
          ) : null}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isTrialMode && !user ? "Free Trial - AI Chat" : (sidebarItems.find(item => item.id === activeTab)?.title || "Dashboard")}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search anything..."
                  className="bg-transparent border-none outline-none text-sm flex-1"
                />
              </div>

              {/* Action Buttons */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>

              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Trial Mode Banner */}
        {isTrialMode && !user && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800 text-center">
                You're using the free trial. Sign up to unlock all features!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/auth'}
                className="ml-4 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        {/* Session Error Banner */}
        {sessionError && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800 text-center">{sessionError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="ml-4 text-xs"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
