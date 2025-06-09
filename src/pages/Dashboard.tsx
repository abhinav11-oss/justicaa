
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useSidebar } from "@/hooks/useSidebar";
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
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('lastTab') || "home";
  });
  const { user, signOut, loading, sessionError } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { 
    isCollapsed, 
    isExpanded, 
    toggleSidebar, 
    handleMouseEnter, 
    handleMouseLeave 
  } = useSidebar();

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
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

  // Don't render dashboard if user is not authenticated
  if (!user) {
    return null;
  }

  const renderMainContent = () => {
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
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background flex">
      {/* Collapsible Vertical Sidebar */}
      <aside 
        className={`bg-card dark:bg-card border-r border-border dark:border-border flex flex-col transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="p-4 border-b border-border dark:border-border">
          <div className="flex items-center justify-between">
            {isExpanded && (
              <div className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-lg">
                  <Scale className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground dark:text-foreground">LegalAI</h1>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Assistant</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center ${
                  isExpanded ? 'space-x-3' : 'justify-center'
                } ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground"
                }`}
                title={!isExpanded ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && (
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-card dark:bg-card border-b border-border dark:border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-foreground capitalize">
                  {sidebarItems.find(item => item.id === activeTab)?.title || "Dashboard"}
                </h2>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  {sidebarItems.find(item => item.id === activeTab)?.description || "Welcome to your legal assistant"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {/* User Profile - Only show if authenticated */}
              {user && (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-foreground dark:text-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground">Signed in</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Session Error Banner */}
        {sessionError && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 p-3">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-200">{sessionError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="ml-4"
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
