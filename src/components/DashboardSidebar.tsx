import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Home,
  MessageSquare,
  Users,
  FilePlus,
  FileText,
  BookOpen,
  Settings,
  Scale,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Calculator,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
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
}

export const DashboardSidebar: React.FC<SidebarProps> = ({
  user,
  isTrialMode,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const sidebarItems = [
    ...(user ? [{ id: "home", icon: Home, title: t("dashboard.title") }] : []),
    { id: "chat", icon: MessageSquare, title: t("dashboard.aiChat") },
    ...(user
      ? [
          {
            id: "matters",
            icon: Briefcase,
            title: "Matters",
          },
          {
            id: "lawyers",
            icon: Users,
            title: t("dashboard.lawyers"),
          },
          {
            id: "generator",
            icon: FilePlus,
            title: t("dashboard.documents"),
          },
          {
            id: "healthcheck",
            icon: ShieldCheck,
            title: "Legal Health Check",
          },
          {
            id: "templates",
            icon: FileText,
            title: t("dashboard.templates"),
          },
          {
            id: "guides",
            icon: BookOpen,
            title: t("dashboard.guides"),
          },
          {
            id: "calculator",
            icon: Calculator,
            title: "Fee Calculator",
          },
          {
            id: "research",
            icon: BookOpen,
            title: "Constitution",
          },
          {
            id: "settings",
            icon: Settings,
            title: t("dashboard.settings"),
          },
        ]
      : []),
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.clear();
      sessionStorage.clear();
      toast({ title: t('settings.signedOut') });
      navigate("/");
    } catch (error) {
      toast({ title: t('common.error'), variant: "destructive" });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "flex items-center mb-10 px-4 h-16",
          isExpanded || isMobile ? "justify-between" : "justify-center"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="gradient-primary p-2 rounded-md flex-shrink-0">
            <Scale className="h-6 w-6 text-primary-foreground" />
          </div>
          {(isExpanded || isMobile) && (
            <span className="font-bold text-lg">Justicaa</span>
          )}
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-2">
        {sidebarItems.map((item) => (
          <Tooltip key={item.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTab === item.id ? "secondary" : "ghost"}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={cn(
                  "w-full h-12",
                  isExpanded || isMobile ? "justify-start gap-3" : "justify-center"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(isExpanded || isMobile) && (
                  <span className="font-medium">{item.title}</span>
                )}
              </Button>
            </TooltipTrigger>
            {!(isExpanded || isMobile) && (
              <TooltipContent side="right">{item.title}</TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>

      <div className="mt-auto p-2">
        {user && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className={cn(
                  "w-full h-12 text-muted-foreground",
                  isExpanded || isMobile ? "justify-start gap-3" : "justify-center"
                )}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {(isExpanded || isMobile) && (
                  <span className="font-medium">{t('settings.signOut')}</span>
                )}
              </Button>
            </TooltipTrigger>
            {!(isExpanded || isMobile) && (
              <TooltipContent side="right">{t('settings.signOut')}</TooltipContent>
            )}
          </Tooltip>
        )}
        {!isMobile && (
          <div className="border-t mt-2 pt-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSidebar = () => (
    <aside
      className={cn(
        "flex-col py-4 bg-card border-r transition-[width] duration-300 ease-in-out",
        isMobile ? "w-64" : isExpanded ? "w-60" : "w-20",
        isMobile ? "fixed inset-y-0 left-0 z-50" : "hidden md:flex"
      )}
    >
      <SidebarContent />
    </aside>
  );

  return (
    <>
      {/* Mobile Overlay & Sidebar */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50"
            >
              {renderSidebar()}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      {!isMobile && renderSidebar()}
    </>
  );
};