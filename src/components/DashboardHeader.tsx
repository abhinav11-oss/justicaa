import React from "react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Menu, Bell, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  isMobile: boolean;
  onMenuClick: () => void;
  user: any;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  isMobile,
  onMenuClick,
  user,
}) => {
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "No new notifications at this time.",
    });
  };

  const userInitial =
    user?.user_metadata?.full_name?.charAt(0) ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <header className="px-6 py-3 flex justify-between items-center bg-background border-b h-16">
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
        <div className="relative hidden md:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 w-64" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
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