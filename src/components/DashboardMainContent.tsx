import React from "react";
import { LegalGuides } from "@/components/LegalGuides";
import { ConstitutionExplorer } from "@/components/ConstitutionExplorer";
import { DocumentTemplates } from "@/components/DocumentTemplates";
import { DocumentTools } from "@/components/DocumentTools";
import { LawyerFinder } from "@/components/LawyerFinder";
import { UserDashboard } from "@/components/UserDashboard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { ChatView } from "@/components/ChatView";
import { LegalFeeCalculator } from "@/components/LegalFeeCalculator";
import { LegalHealthCheck } from "@/components/LegalHealthCheck";
import { LegalMattersManager } from "@/components/LegalMattersManager";

interface MainContentProps {
  activeTab: string;
  isTrialMode: boolean;
  user: any;
  onSelectConversation: (id: string | null) => void;
  onNewConversation: () => void;
  activeConversationId: string | null;
}

export const DashboardMainContent: React.FC<MainContentProps> = ({
  activeTab,
  isTrialMode,
  user,
  onSelectConversation,
  onNewConversation,
  activeConversationId,
}) => {
  if (isTrialMode && !user) {
    return <ChatView onSelectConversation={onSelectConversation} onNewConversation={onNewConversation} conversationId={activeConversationId} />;
  }
  switch (activeTab) {
    case "home":
      return <UserDashboard onSelectConversation={onSelectConversation} />;
    case "chat":
      return <ChatView onSelectConversation={onSelectConversation} onNewConversation={onNewConversation} conversationId={activeConversationId} />;
    case "matters":
      return <LegalMattersManager />;
    case "lawyers":
      return <LawyerFinder category="all" />;
    case "generator":
      return <DocumentTools category="all" />;
    case "healthcheck":
      return <LegalHealthCheck />;
    case "templates":
      return <DocumentTemplates />;
    case "guides":
      return <LegalGuides />;
    case "calculator":
      return <LegalFeeCalculator />;
    case "research":
      return <ConstitutionExplorer />;
    case "settings":
      return <SettingsPanel />;
    default:
      return user ? <UserDashboard onSelectConversation={onSelectConversation} /> : <ChatView onSelectConversation={onSelectConversation} onNewConversation={onNewConversation} conversationId={activeConversationId} />;
  }
};