import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  X
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
      description: "Dashboard"
    },
    {
      id: "chat",
      title: "AI Chat",
      icon: MessageSquare,
      description: "Legal Chat"
    },
    {
      id: "lawyers",
      title: "Lawyers",
      icon: Users,
      description: "Find Experts"
    },
    {
      id: "generator",
      title: "Generator",
      icon: FilePlus,
      description: "Create Docs"
    },
    {
      id: "templates",
      title: "Templates",
      icon: FileText,
      description: "Doc Templates"
    },
    {
      id: "guides",
      title: "Guides",
      icon: BookOpen,
      description: "Legal Guides"
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
      description: "Preferences"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
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
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background dark:bg-gray-900 flex flex-col md:flex-row relative">
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
          bg-card dark:bg-gray-800 border-r border-border dark:border-gray-700 
          ${isMobile ? 'w-64 h-full z-50' : 'w-16'} 
          transition-transform duration-300 ease-in-out
          flex flex-col
        `}>
          {/* Header */}
          <div className="p-2 border-b border-border dark:border-gray-700 flex justify-center">
            <div className="gradient-primary p-2 rounded-xl">
              <Scale className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 relative z-10">
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                isMobile ? (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center space-x-3 ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary border-2 border-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </button>
                ) : (
                  <Tooltip key={item.id} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full p-3 rounded-xl transition-all duration-200 flex items-center justify-center relative ${
                          activeTab === item.id
                            ? "bg-primary/10 text-primary border-2 border-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      className="flex flex-col bg-popover dark:bg-gray-800 border border-border dark:border-gray-600 shadow-lg"
                      sideOffset={8}
                    >
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </TooltipContent>
                  </Tooltip>
                )
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-screen relative">
          {/* Top Bar */}
          <header className="bg-card dark:bg-gray-800 border-b border-border dark:border-gray-700 p-3 md:p-4 relative z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Mobile Menu Button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                )}
                
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-foreground dark:text-white capitalize">
                    {sidebarItems.find(item => item.id === activeTab)?.title || "Dashboard"}
                  </h2>
                  <p className="text-xs md:text-sm text-muted-foreground dark:text-gray-400 hidden sm:block">
                    {sidebarItems.find(item => item.id === activeTab)?.description || "Welcome to your legal assistant"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Theme Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="h-8 w-8 md:h-10 md:w-10 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
                </Button>
                
                {/* User Profile - Only show if authenticated */}
                {user && (
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Avatar className="h-6 w-6 md:h-8 md:w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="gradient-primary text-white text-xs">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block">
                      <p className="text-sm font-medium text-foreground dark:text-white truncate max-w-32">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">Signed in</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs md:text-sm dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      <LogOut className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Session Error Banner */}
          {sessionError && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 p-3 relative z-20">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-amber-200 text-center">{sessionError}</p>
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
          <div className="flex-1 p-3 md:p-6 overflow-auto bg-background dark:bg-gray-900 relative z-10">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Dashboard;