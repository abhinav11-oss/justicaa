import React from "react";
import {
  Home,
  MessageSquare,
  Users,
  FilePlus,
  FileText,
  BookOpen,
  Search,
  Settings,
  User,
  Scale,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const sidebarIcons = [
  { id: "home", icon: Home, title: "Dashboard" },
  { id: "chat", icon: MessageSquare, title: "AI Chat" },
  { id: "lawyers", icon: Users, title: "Find Experts" },
  { id: "generator", icon: FilePlus, title: "Generate" },
  { id: "templates", icon: FileText, title: "Legal Forms" },
  { id: "guides", icon: BookOpen, title: "Legal Info" },
  { id: "research", icon: Search, title: "Case Law" },
  { id: "settings", icon: Settings, title: "Account" },
];

interface SidebarProps {
  user: any;
  isTrialMode: boolean;
  activeTab: string;
  setActiveTab: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  t: any; // add translation prop
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  user,
  isTrialMode,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  t,
}) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  // Translation applied for sidebar icon titles
  const sidebarIcons = [
    { id: "home", icon: Home, title: t("dashboard.title") },
    { id: "chat", icon: MessageSquare, title: t("dashboard.aiChat") },
    {
      id: "lawyers",
      icon: Users,
      title: t("dashboard.lawyers", "Find Experts"),
    },
    {
      id: "generator",
      icon: FilePlus,
      title: t("dashboard.documents", "Generate"),
    },
    {
      id: "templates",
      icon: FileText,
      title: t("dashboard.templates", "Legal Forms"),
    },
    {
      id: "guides",
      icon: BookOpen,
      title: t("dashboard.guides", "Legal Info"),
    },
    {
      id: "research",
      icon: Search,
      title: t("dashboard.research", "Case Law"),
    },
    {
      id: "settings",
      icon: Settings,
      title: t("dashboard.settings", "Account"),
    },
  ];

  const iconsToShow = user
    ? sidebarIcons
    : sidebarIcons.filter((i) => ["chat"].includes(i.id));

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`
          ${isMobile ? "fixed" : "relative"}
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
          text-white
          ${isMobile ? "w-20 h-full z-50" : "w-20"}
          transition-transform duration-300 ease-in-out
          flex flex-col items-center pt-2
        `}
        style={{
          background:
            theme === "dark" ? "hsl(var(--sidebar))" : "hsl(var(--card))",
          color:
            theme === "dark"
              ? "hsl(var(--sidebar-foreground))"
              : "hsl(var(--foreground))",
        }}
      >
        <div className="mb-6 mt-2">
          <div className="p-2 rounded-xl gradient-primary">
            <Scale className="h-7 w-7 text-white" />
          </div>
        </div>
        <nav className="flex-1 flex flex-col space-y-4 items-center w-full">
          {iconsToShow.map((item) => (
            <div key={item.id} className="w-full flex justify-center">
              <div className="relative group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      className={`
                        flex items-center justify-center w-12 h-12 rounded-xl
                        transition-all duration-200
                        ${
                          activeTab === item.id
                            ? "bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-md"
                            : "text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-purple-500"
                        }
                      `}
                      style={{ fontSize: 0 }}
                      aria-label={item.title}
                    >
                      <item.icon className="h-6 w-6" />
                    </button>
                  </TooltipTrigger>
                  {/* Always show Tooltip above all and only on desktop (not mobile) */}
                  {!isMobile && (
                    <TooltipContent
                      side="right"
                      align="center"
                      className="z-[99999] absolute px-3 py-1 text-xs rounded-md bg-white shadow-md text-black whitespace-nowrap"
                      style={{ minWidth: 90 }}
                    >
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>
          ))}
        </nav>
        {/* User avatar or trial -- at bottom, just an icon */}
        <div
          className="p-3 border-t w-full flex flex-col items-center"
          style={{
            borderColor:
              theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
          }}
        >
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="gradient-primary text-white">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          ) : isTrialMode ? (
            <User className="h-8 w-8 text-purple-500" />
          ) : null}
        </div>
      </aside>
    </>
  );
};
