import React from "react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Menu, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  isMobile: boolean;
  onMenuClick: () => void;
  activeTab: string;
  sidebarItems: Array<{ id: string; title: string }>;
  isTrialMode: boolean;
  user: any;
  t: any;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  isMobile,
  onMenuClick,
  activeTab,
  sidebarItems,
  isTrialMode,
  user,
  t,
}) => {
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "No new notifications at this time.",
    });
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <header className="px-6 py-3 flex justify-between items-center bg-card border-b">
      <div className="flex items-center space-x-4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {isTrialMode && !user
              ? "Free Trial"
              : sidebarItems.find((item) => item.id === activeTab)?.title || "Dashboard"}
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSelector />
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          onClick={handleNotificationClick}
        >
          <Bell className="h-5 w-5" />
        </Button>
        {user && (
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {userInitial}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
};