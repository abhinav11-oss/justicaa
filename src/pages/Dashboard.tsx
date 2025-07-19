import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardMainContent } from "@/components/DashboardMainContent";

const Dashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem("lastTab") || "home";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, sessionError } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const isTrialMode =
    !user &&
    (window.location.search.includes("trial=true") ||
      localStorage.getItem("trialMode") === "true");

  useEffect(() => {
    if (isTrialMode) {
      localStorage.setItem("trialMode", "true");
      if (!user) setActiveTab("chat");
    }
  }, [isTrialMode, user]);

  useEffect(() => {
    if (!loading && !user && !isTrialMode) {
      navigate("/");
    }
  }, [user, loading, navigate, isTrialMode]);

  useEffect(() => {
    sessionStorage.setItem("lastTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (sessionError) {
      toast({
        title: "Session Error",
        description: sessionError,
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [sessionError, toast]);

  const sidebarItems = [
    ...(user ? [{ id: "home", title: t("dashboard.title") }] : []),
    { id: "chat", title: t("dashboard.aiChat") },
    ...(user
      ? [
          { id: "lawyers", title: t("dashboard.lawyers") },
          { id: "generator", title: t("dashboard.documents") },
          { id: "templates", title: t("dashboard.templates") },
          { id: "guides", title: t("dashboard.guides") },
          { id: "research", title: t("dashboard.research") },
          { id: "settings", title: t("dashboard.settings") },
        ]
      : []),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && !isTrialMode) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        user={user}
        isTrialMode={isTrialMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        t={t}
      />
      <main className="flex-1 flex flex-col">
        <DashboardHeader
          isMobile={isMobile}
          onMenuClick={() => setSidebarOpen(true)}
          activeTab={activeTab}
          sidebarItems={sidebarItems}
          isTrialMode={isTrialMode}
          user={user}
          t={t}
        />
        
        {isTrialMode && !user && (
          <div className="px-6 py-2 bg-primary/10 border-b border-primary/20">
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <p className="text-sm text-center text-primary">
                You're in trial mode. Sign up to unlock all features!
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate("/auth")}
                className="text-primary font-bold"
              >
                Sign Up
              </Button>
            </div>
          </div>
        )}

        {sessionError && (
          <div className="px-6 py-2 bg-destructive/10 border-b border-destructive/20">
            <div className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-center text-destructive">{sessionError}</p>
            </div>
          </div>
        )}

        <div className="flex-1 p-6 overflow-y-auto">
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