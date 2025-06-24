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
  Menu, // Import Menu icon
  X,    // Import X icon
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
import { cn } from "@/lib/utils"; // Import cn for conditional classes

interface SidebarProps {
  user: any;
  isTrialMode: boolean;
  activeTab: string;
  setActiveTab: (id: string) => void;
  sidebarOpen: boolean; // Controlled by parent (Dashboard.tsx) for mobile
  setSidebarOpen: (open: boolean) => void; // Controlled by parent (Dashboard.tsx) for mobile
  t: any; // add translation prop
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  user,
  isTrialMode,
  activeTab,
  setActiveTab,
  sidebarOpen, // Controlled by parent (Dashboard.tsx) for mobile
  setSidebarOpen, // Controlled by parent (Dashboard.tsx) for mobile
  t,
}) => {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // New state for desktop sidebar expansion on hover
  const [isExpanded, setIsExpanded] = useState(false);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  const sidebarItems = [
    ...(user
      ? [
          {
            id: "home",
            icon: Home,
            title: t("dashboard.title"),
          },
        ]
      : []),
    {
      id: "chat",
      icon: MessageSquare,
      title: t("dashboard.aiChat"),
    },
    ...(user
      ? [
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
        ]
      : []),
  ];

  const iconsToShow = user
    ? sidebarItems
    : sidebarItems.filter((i) => ["chat"].includes(i.id));

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
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial={{ width: "60px" }} // Start collapsed
          animate={{ width: isExpanded ? "240px" : "60px" }} // Animate width on hover
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className={`
            relative flex flex-col items-center pt-4
            bg-card/80 backdrop-blur-xl
            text-card-foreground h-screen overflow-hidden
          `}
        >
          <motion.div
            className="mb-8 mt-2 flex items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 rounded-2xl gradient-primary shadow-lg flex-shrink-0">
              <Scale className="h-7 w-7 text-white" />
            </div>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="ml-3"
              >
                <h1 className="text-xl font-bold text-foreground whitespace-nowrap">Justicaa</h1>
                <p className="text-xs text-muted-foreground whitespace-nowrap">AI Legal Assistant</p>
              </motion.div>
            )}
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
                <div className="relative group w-full">
                  <Tooltip delayDuration={0}> {/* Instant tooltip */}
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => setActiveTab(item.id)}
                        whileHover={{ scale: 1.05 }} // Slightly reduced scale
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          `flex items-center w-full rounded-2xl py-3 px-3
                          transition-all duration-300 relative overflow-hidden
                          ${
                            activeTab === item.id
                              ? "gradient-primary text-white shadow-lg"
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          }`,
                          isExpanded ? "justify-start" : "justify-center"
                        )}
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
                        <item.icon className="h-6 w-6 relative z-10 flex-shrink-0" />
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                            className="ml-3 text-sm font-medium whitespace-nowrap relative z-10"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    {!isExpanded && ( // Only show tooltip when collapsed
                      <TooltipContent
                        side="right"
                        align="center"
                        className="z-[99999] px-3 py-2 text-sm rounded-xl bg-card" {/* Removed border class */}
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
            className="p-4 w-full flex flex-col items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {user ? (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="gradient-primary text-white font-semibold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            ) : isTrialMode ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <User className="h-5 w-5 text-primary" />
              </motion.div>
            ) : null}
            {user && (
              <motion.div
                className="mt-4 w-full flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSignOut}
                      className={cn(
                        `rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive`,
                        isExpanded ? "w-full py-3 px-3 justify-start" : "w-14 h-14"
                      )}
                      aria-label={t("dashboard.signOut", "Sign Out")}
                    >
                      <LogOut className="h-6 w-6 flex-shrink-0" />
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1, duration: 0.2 }}
                          className="ml-3 text-sm font-medium whitespace-nowrap"
                        >
                          {t("dashboard.signOut", "Sign Out")}
                        </motion.span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent
                      side="right"
                      align="center"
                      className="z-[99999] px-3 py-2 text-sm rounded-xl bg-card" {/* Removed border class */}
                    >
                      {t("dashboard.signOut", "Sign Out")}
                    </TooltipContent>
                  )}
                </Tooltip>
              </motion.div>
            )}
          </motion.div>
        </motion.aside>
      )}

      {/* Mobile Sidebar (Drawer-like) */}
      {isMobile && (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 w-64 bg-card z-50 flex flex-col pt-4 shadow-lg"
            >
              <div className="flex items-center justify-between px-4 mb-8 mt-2">
                <div className="flex items-center">
                  <div className="p-3 rounded-2xl gradient-primary shadow-lg">
                    <Scale className="h-7 w-7 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-foreground ml-3">Justicaa</h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  aria-label={t("dashboard.closeMenu", "Close Menu")}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 flex flex-col space-y-3 items-start w-full px-4">
                {iconsToShow.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false); // Close sidebar on item click
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center w-full rounded-xl py-3 px-3
                      transition-all duration-200
                      ${
                        activeTab === item.id
                          ? "gradient-primary text-white shadow-lg"
                          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      }
                    `}
                    aria-label={item.title}
                  >
                    <item.icon className="h-6 w-6 mr-3" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </motion.button>
                ))}
              </nav>
              <div className="p-4 w-full flex flex-col items-center">
                {user ? (
                  <Avatar className="h-10 w-10 mb-4">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="gradient-primary text-white font-semibold">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                ) : isTrialMode ? (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                ) : null}
                {user && (
                  <Button
                    variant="destructive"
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("dashboard.signOut", "Sign Out")}
                  </Button>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      )}
    </>
  );
};