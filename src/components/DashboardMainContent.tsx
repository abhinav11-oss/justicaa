import React from "react";
import { LegalGuides } from "@/components/LegalGuides";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { DocumentTemplates } from "@/components/DocumentTemplates";
import { DocumentTools } from "@/components/DocumentTools";
import { LawyerFinder } from "@/components/LawyerFinder";
import { UserDashboard } from "@/components/UserDashboard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ChatView } from "@/components/ChatView";

interface MainContentProps {
  activeTab: string;
  isTrialMode: boolean;
  user: any;
  t: any;
}

export const DashboardMainContent: React.FC<MainContentProps> = ({
  activeTab,
  isTrialMode,
  user,
  t
}) => {
  if (isTrialMode && !user) {
    return <ChatView />;
  }
  switch (activeTab) {
    case "home":
      return <UserDashboard />;
    case "chat":
      return <ChatView />;
    case "lawyers":
      return <LawyerFinder category="all" />;
    case "generator":
      return <DocumentTools category="all" />;
    case "templates":
      return <DocumentTemplates />;
    case "guides":
      return <LegalGuides />;
    case "research":
      return <KnowledgeBase />;
    case "settings":
      return <SettingsPanel />;
    default:
      return user ? <UserDashboard /> : <ChatView />;
  }
};