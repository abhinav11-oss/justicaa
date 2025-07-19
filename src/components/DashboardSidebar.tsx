import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: any;
  isTrialMode: boolean;
  activeTab: string;
  setActiveTab: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  t: any;
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
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  const sidebarItems = [
    ...(user ? [{ id: "home", icon: Home, title: t("dashboard.title") }] : []),
    { id: "chat", icon: MessageSquare, title: t("dashboard.aiChat") },
    ...(user
      ? [
          { id: "lawyers", icon: Users, title: t("dashboard.lawyers", "Find Experts") },
          { id: "generator", icon: FilePlus, title: t("dashboard.documents", "Generate") },
          { id: "templates", icon: FileText, title: t("dashboard.templates", "Legal Forms") },
          { id: "guides", icon: BookOpen, title: t("dashboard.guides", "Legal Info") },
          { id: "research", icon: Search, title: t("dashboard.research", "Case Law") },
          { id: "settings", icon: Settings, title: t("dashboard.settings", "Account") },
        ]
      : []),
  ];

  const iconsToShow = user ? sidebarItems : sidebarItems.filter((i) => ["chat"].includes(i.id));

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem("lastTab");
      localStorage.removeItem("trialMode");
      localStorage.removeItem("trialMessagesUsed");
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "There was an issue signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-4 mb-8 mt-2">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-primary">
            <Scale className="h-6 w-6 text-primary-foreground" />
          </div>
          {(isExpanded || isMobile) && (
            <h1 className="text-xl font-bold text-foreground ml-3">Justicaa</h1>
          )}
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Menu"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex-1 flex flex-col space-y-2 w-full px-3">
        {iconsToShow.map((item) => (
          <Tooltip key={item.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={cn(
                  "w-full transition-all duration-200",
                  isExpanded || isMobile ? "justify-start" : "justify-center",
                  activeTab === item.id && "bg-primary text-primary-foreground"
                )}
                aria-label={item.title}
              >
                <item.icon className="h-5 w-5" />
                {(isExpanded || isMobile) && (
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                )}
              </Button>
            </TooltipTrigger>
            {!isExpanded && !isMobile && (
              <TooltipContent side="right" align="center">
                {item.title}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>
      <div className="p-4 w-full">
        {user && (
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className={cn(
              "w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              isExpanded || isMobile ? "justify-start" : "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {(isExpanded || isMobile) && (
              <span className="ml-3 text-sm font-medium">Sign Out</span>
            )}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {!isMobile && (
        <aside
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className={cn(
            "relative flex flex-col items-center py-4 bg-card border-r transition-[width] duration-300 ease-in-out",
            isExpanded ? "w-60" : "w-20"
          )}
        >
          {sidebarContent}
        </aside>
      )}

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 w-64 bg-card z-50 flex flex-col py-4 shadow-lg"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};