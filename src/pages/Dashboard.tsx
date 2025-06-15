import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { LanguageSelector } from "@/components/LanguageSelector";
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
  const { t } = useTranslation();
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
        title: t('common.error'),
        description: sessionError,
        variant: "destructive",
        duration: 5000
      });
    }
  }, [sessionError, toast, t]);

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

  // New: sidebar icon-tooltips mapping for accessibility and usability.
  const sidebarItems = [
    ...(user ? [{
      id: "home",
      title: t('dashboard.title'),
      icon: Home, // Lucide icon
      description: "Overview"
    }] : []),
    {
      id: "chat",
      title: t('dashboard.aiChat'),
      icon: MessageSquare,
      description: "Legal Assistant"
    },
    ...(user ? [
      {
        id: "lawyers",
        title: t('dashboard.lawyers'),
        icon: Users,
        description: "Find Experts"
      },
      {
        id: "generator",
        title: t('dashboard.documents'),
        icon: FilePlus,
        description: "Generate"
      },
      {
        id: "templates",
        title: t('dashboard.templates'),
        icon: FileText,
        description: "Legal Forms"
      },
      {
        id: "guides",
        title: t('dashboard.guides'),
        icon: BookOpen,
        description: "Legal Info"
      },
      {
        id: "research",
        title: t('dashboard.research'),
        icon: Search,
        description: "Case Law"
      },
      {
        id: "settings",
        title: t('dashboard.settings'),
        icon: Settings,
        description: "Account"
      }
    ] : [])
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'hsl(var(--surface))' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'hsl(var(--primary))' }}></div>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>{t('common.loading')}</p>
          {sessionError && (
            <div className="mt-4 p-3 rounded-lg max-w-md status-warning">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm">{sessionError}</p>
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
    <div className="min-h-screen flex relative w-full" 
      // Improved: use conditional classNames for precise color contrast
      style={{
        background: theme === "dark" 
          ? 'hsl(var(--surface), 1)'
          : 'hsl(var(--background), 1)'
      }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Now, icon only w/ tooltips */}
      <aside
        className={`
          ${isMobile ? 'fixed' : 'relative'} 
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          text-white
          ${isMobile ? 'w-20 h-full z-50' : 'w-20'} 
          transition-transform duration-300 ease-in-out
          flex flex-col items-center pt-2
        `}
        style={{
          background: theme === "dark"
            ? 'hsl(var(--sidebar))'
            : 'hsl(var(--card))',
          color: theme === "dark" 
            ? 'hsl(var(--sidebar-foreground))'
            : 'hsl(var(--foreground))'
        }}
      >
        {/* Header (small logo) */}
        <div className="mb-6 mt-2">
          <div className="p-2 rounded-xl gradient-primary">
            <Scale className="h-7 w-7 text-white" />
          </div>
        </div>
        {/* Navigation: only icons, each with a Tooltip*/}
        <nav className="flex-1 flex flex-col space-y-4 items-center w-full">
          {sidebarItems.map((item) => (
            <div key={item.id} className="w-full flex justify-center">
              <div className="relative group">
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-xl
                    transition-all duration-200
                    ${activeTab === item.id
                      ? "bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-md"
                      : "text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-purple-500"}
                  `}
                  style={{
                    fontSize: 0 // visually hide label, only show icon
                  }}
                  aria-label={item.title}
                >
                  <item.icon className="h-6 w-6" />
                </button>
                {/* Tooltip on hover (hidden on mobile since it's touch) */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition bg-black bg-opacity-80 text-white text-xs rounded-md px-3 py-1 whitespace-nowrap z-50"
                  style={{ minWidth: 80 }}
                >
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </nav>
        {/* User avatar or trial--now shown at bottom, just an icon */}
        <div className="p-3 border-t w-full flex flex-col items-center"
          style={{ borderColor: theme === "dark" ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }}
        >
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="gradient-primary text-white">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          ) : isTrialMode ? (
            <User className="h-8 w-8 text-purple-500" />
          ) : null}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header
          className={`px-6 py-4 border-b flex justify-between items-center`}
          style={{
            background: theme === "dark" ? 'hsl(var(--card))' : 'hsl(var(--card), 1)',
            borderColor: 'hsl(var(--border))',
            color: theme === "dark" ? 'hsl(var(--card-foreground))' : 'hsl(var(--foreground))'
          }}
        >
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
              <h1 className="text-2xl font-bold"
                style={{ color: theme === "dark" ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))' }}
              >
                {isTrialMode && !user ? "Free Trial - AI Chat" : (sidebarItems.find(item => item.id === activeTab)?.title || t('dashboard.title'))}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Dark mode toggle - stays in top right */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={theme === "dark" ? "text-yellow-200" : "text-purple-500"}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Notifications button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              tabIndex={-1}
              aria-label="Notifications"
              style={{ color: theme === "dark" ? '#ffd700' : '#8833ff' /* purple or yellow accent */ }}
              disabled
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-card"></span>
            </Button>

            {/* Mail button */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Mail"
              className={`${theme === "dark" ? "text-teal-200" : "text-blue-500"}`}
              disabled
            >
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </header>
        {/* Trial Mode Banner */}
        {isTrialMode && !user && (
          <div className="px-6 py-3" style={{ 
            background: 'rgba(125, 106, 255, 0.05)', 
            borderBottom: '1px solid rgba(125, 106, 255, 0.2)' 
          }}>
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="h-4 w-4 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
              <p className="text-sm text-center" style={{ color: 'hsl(var(--primary))' }}>
                You're using the free trial. Sign up to unlock all features!
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/auth'}
                className="ml-4 text-xs btn-outline"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        {/* Session Error Banner */}
        {sessionError && (
          <div className="px-6 py-3 status-warning">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm text-center">{sessionError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="ml-4 text-xs"
              >
                {t('common.retry')}
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto"
          style={{
            background: 'hsl(var(--surface))',
            color: 'hsl(var(--foreground))',
          }}
        >
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
