
import React from "react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, Bell, Mail, AlertTriangle } from "lucide-react";

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
}) => {
  const { theme, setTheme } = useTheme();

  return (
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
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold"
            style={{ color: theme === "dark" ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))' }}
          >
            {isTrialMode && !user
              ? "Free Trial - AI Chat"
              : (sidebarItems.find(item => item.id === activeTab)?.title || t('dashboard.title'))}
          </h1>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {/* Language Selector */}
        <LanguageSelector />

        {/* Dark mode toggle */}
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
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Place notification indicator */}
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-card"></span>
        </Button>

        {/* Mail button */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Mail"
          className={`${theme === "dark" ? "text-teal-200" : "text-blue-500"}`}
        >
          <Mail className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
