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
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardMainContent } from "@/components/DashboardMainContent";

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
    }] : []),
    {
      id: "chat",
      title: t('dashboard.aiChat'),
    },
    ...(user ? [
      {
        id: "lawyers",
        title: t('dashboard.lawyers'),
      },
      {
        id: "generator",
        title: t('dashboard.documents'),
      },
      {
        id: "templates",
        title: t('dashboard.templates'),
      },
      {
        id: "guides",
        title: t('dashboard.guides'),
      },
      {
        id: "research",
        title: t('dashboard.research'),
      },
      {
        id: "settings",
        title: t('dashboard.settings'),
      },
    ] : [])
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4" style={{ background: 'hsl(var(--surface))' }}
      >
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

  // IMPORTANT: Only check redirect/return null after loading is complete!
  if (!user && !isTrialMode) {
    navigate("/");
    return null;
  }

  return (
    <div
      className="min-h-screen flex relative w-full overflow-visible"
      style={{
        background: theme === "dark"
          ? 'hsl(var(--surface), 1)'
          : 'hsl(var(--background), 1)'
      }}
    >
      <DashboardSidebar
        user={user}
        isTrialMode={isTrialMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        t={t}
      />
      <main className="flex-1 flex flex-col min-h-screen z-0 relative">
        <DashboardHeader
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(true)}
          activeTab={activeTab}
          sidebarItems={sidebarItems}
          isTrialMode={isTrialMode}
          user={user}
          t={t}
        />
        {/* Trial Mode Banner */}
        {isTrialMode && !user && (
          <div className="px-6 py-3" style={{ 
            background: 'rgba(125, 106, 255, 0.05)', 
            borderBottom: '1px solid rgba(125, 106, 255, 0.2)' 
          }}>
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="h-4 w-4 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
              <p className="text-sm text-center" style={{ color: 'hsl(var(--primary))' }}>
                {t('dashboard.trialBanner', 'You\'re using the free trial. Sign up to unlock all features!')}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/auth'}
                className="ml-4 text-xs btn-outline"
              >
                {t('auth.signUp')}
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
        <div className="flex flex-col z-0 relative overflow-visible flex-1 p-6"
          style={{
            background: 'hsl(var(--surface))',
            color: 'hsl(var(--foreground))',
          }}
        >
          <DashboardMainContent
            activeTab={activeTab}
            isTrialMode={isTrialMode}
            user={user}
            t={t}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
