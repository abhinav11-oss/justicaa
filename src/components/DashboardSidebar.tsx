import React from "react";
import { motion } from "framer-motion";
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
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <>
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <motion.aside
        initial={{ x: isMobile ? -100 : 0 }}
        animate={{ x: 0 }}
        className={`
          ${isMobile ? "fixed" : "relative"}
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
          ${isMobile ? "w-20 h-full z-50" : "w-20"}
          transition-transform duration-300 ease-in-out
          flex flex-col items-center pt-4
          bg-card/80 backdrop-blur-xl border-r border-border
          text-card-foreground
        `}
      >
        <motion.div
          className="mb-8 mt-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-3 rounded-2xl gradient-primary shadow-lg">
            <Scale className="h-7 w-7 text-white" />
          </div>
        </motion.div>
        <nav className="flex-1 flex flex-col space-y-3 items-center w-full px-2">
          {iconsToShow.map((item, index) => (
            <motion.div
              key={item.id}
              className="w-full flex justify-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="relative group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => {
                        setActiveTab(item.id);
                        if (isMobile) setSidebarOpen(false);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        flex items-center justify-center w-14 h-14 rounded-2xl
                        transition-all duration-300 relative overflow-hidden
                        ${
                          activeTab === item.id
                            ? "gradient-primary text-white shadow-lg"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary-foreground" // Changed hover:text-primary to hover:text-primary-foreground
                        }
                      `}
                      aria-label={item.title}
                    >
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 gradient-primary rounded-2xl"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      <item.icon className="h-6 w-6 relative z-10" />
                    </motion.button>
                  </TooltipTrigger>
                  {/* Always show Tooltip above all and only on desktop (not mobile) */}
                  {!isMobile && (
                    <TooltipContent
                      side="right"
                      align="center"
                      className="z-[99999] px-3 py-2 text-sm rounded-xl bg-card border border-border shadow-lg text-card-foreground"
                    >
                      {item.title}
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </motion.div>
          ))}
        </nav>
        {/* User avatar or trial -- at bottom, just an icon */}
        <motion.div
          className="p-4 border-t border-border/50 w-full flex flex-col items-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {user ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Avatar className="h-10 w-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="gradient-primary text-white font-semibold"> {/* Changed bg-primary to gradient-primary */}
                  {userInitial}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          ) : isTrialMode ? (
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <User className="h-5 w-5 text-primary-foreground" /> {/* Changed text-primary to text-primary-foreground */}
            </motion.div>
          ) : null}
          {user && (
            <motion.div
              className="mt-4 w-full flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className="w-14 h-14 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={t("dashboard.signOut", "Sign Out")}
                  >
                    <LogOut className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                {!isMobile && (
                  <TooltipContent
                    side="right"
                    align="center"
                    className="z-[99999] px-3 py-2 text-sm rounded-xl bg-card border border-border shadow-lg text-card-foreground"
                  >
                    {t("dashboard.signOut", "Sign Out")}
                  </TooltipContent>
                )}
              </Tooltip>
            </motion.div>
          )}
        </motion.div>
      </motion.aside>
    </>
  );
};