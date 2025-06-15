
import React from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { LegalGuides } from "@/components/LegalGuides";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { DocumentTemplates } from "@/components/DocumentTemplates";
import { DocumentGenerator } from "@/components/DocumentGenerator";
import { LawyerFinder } from "@/components/LawyerFinder";
import { UserDashboard } from "@/components/UserDashboard";
import { SettingsPanel } from "@/components/SettingsPanel";

interface MainContentProps {
  activeTab: string;
  isTrialMode: boolean;
  user: any;
}

export const DashboardMainContent: React.FC<MainContentProps> = ({
  activeTab,
  isTrialMode,
  user
}) => {
  if (isTrialMode && !user) {
    return <ChatInterface category="all" />;
  }
  switch (activeTab) {
    case "home":
      return <UserDashboard />;
    case "chat":
      return <ChatInterface category="all" />;
    case "lawyers":
      return <LawyerFinder category="all" />;
    case "generator":
      return <DocumentGenerator category="all" />;
    case "templates":
      return <DocumentTemplates />;
    case "guides":
      return <LegalGuides />;
    case "research":
      return <KnowledgeBase />;
    case "settings":
      return <SettingsPanel />;
    default:
      return user ? <UserDashboard /> : <ChatInterface category="all" />;
  }
};
