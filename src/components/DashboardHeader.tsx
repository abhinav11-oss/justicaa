import React from "react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Menu, Bell, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  isMobile: boolean;
  onMenuClick: () => void;
  activeTab: string;
  sidebarItems: Array<{ id: string; title: string }>;
  isTrialMode: boolean;
  user: any;
  t: any;
  sessionError?: string;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  isMobile,
  onMenuClick,
  activeTab,
  sidebarItems,
  isTrialMode,
  user,
  t,
  sessionError,
}) => {
  const { toast } = useToast();

  // Helper handlers for notification/mail actions
  const handleNotificationClick = () => {
    toast({
      title: t?.("dashboard.notifications") || "Notifications",
      description:
        t?.("dashboard.notificationsDescription") ||
        "No new notifications at this time.",
      duration: 4000,
    });
  };

  const handleMailClick = () => {
    toast({
      title: t?.("dashboard.mail") || "Inbox",
      description: t?.("dashboard.mailDescription") || "No new mail.",
      duration: 4000,
    });
  };

  return (
    <header
      className={`px-6 py-4 border-b flex justify-between items-center bg-card text-card-foreground`}
      style={{
        borderColor: "hsl(var(--border))",
      }}
    >
      <div className="flex items-center space-x-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
            aria-label={t("dashboard.menu", "Menu")}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isTrialMode && !user
              ? t("dashboard.freeTrial", "Free Trial - AI Chat")
              : sidebarItems.find((item) => item.id === activeTab)?.title ||
                t("dashboard.title")}
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <LanguageSelector />

        {/* Notifications button without badge */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t("dashboard.notifications", "Notifications")}
          onClick={handleNotificationClick}
        >
          <Bell className="h-5 w-5" />
        </Button>

        {/* Mail button */}
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("dashboard.mail", "Mail")}
          className="text-primary"
          onClick={handleMailClick}
        >
          <Mail className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
