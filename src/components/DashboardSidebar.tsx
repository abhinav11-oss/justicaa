
import React from "react";
import { Home, MessageSquare, Users, FilePlus, FileText, BookOpen, Search, Settings, User, Scale } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

const sidebarIcons = [
  { id: "home", icon: Home, title: "Dashboard" },
  { id: "chat", icon: MessageSquare, title: "AI Chat" },
  { id: "lawyers", icon: Users, title: "Find Experts" },
  { id: "generator", icon: FilePlus, title: "Generate" },
  { id: "templates", icon: FileText, title: "Legal Forms" },
  { id: "guides", icon: BookOpen, title: "Legal Info" },
  { id: "research", icon: Search, title: "Case Law" },
  { id: "settings", icon: Settings, title: "Account" }
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
  t
}) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  // Translation applied for sidebar icon titles
  const sidebarIcons = [
    { id: "home", icon: Home, title: t('dashboard.title') },
    { id: "chat", icon: MessageSquare, title: t('dashboard.aiChat') },
    { id: "lawyers", icon: Users, title: t('dashboard.lawyers', "Find Experts") },
    { id: "generator", icon: FilePlus, title: t('dashboard.documents', "Generate") },
    { id: "templates", icon: FileText, title: t('dashboard.templates', "Legal Forms") },
    { id: "guides", icon: BookOpen, title: t('dashboard.guides', "Legal Info") },
    { id: "research", icon: Search, title: t('dashboard.research', "Case Law") },
    { id: "settings", icon: Settings, title: t('dashboard.settings', "Account") }
  ];

  const iconsToShow = user ? sidebarIcons : sidebarIcons.filter(i => ["chat"].includes(i.id));

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
          ${isMobile ? 'fixed' : 'relative'} 
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          text-white
          ${isMobile ? 'w-20 h-full z-50' : 'w-20'} 
          transition-transform duration-300 ease-in-out
          flex flex-col items-center pt-2
        `}
        style={{
          background: theme === "dark" ? 'hsl(var(--sidebar))' : 'hsl(var(--card))',
          color: theme === "dark" ? 'hsl(var(--sidebar-foreground))' : 'hsl(var(--foreground))'
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
                  style={{ fontSize: 0 }}
                  aria-label={item.title}
                >
                  <item.icon className="h-6 w-6" />
                </button>
                {/* Tooltip on hover (hidden on mobile) */}
                <div className="absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition bg-black bg-opacity-80 text-white text-xs rounded-md px-3 py-1 whitespace-nowrap z-50 shadow-lg"
                  style={{ minWidth: 90 }}
                >
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </nav>
        {/* User avatar or trial -- at bottom, just an icon */}
        <div className="p-3 border-t w-full flex flex-col items-center"
          style={{ borderColor: theme === "dark" ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }}
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
