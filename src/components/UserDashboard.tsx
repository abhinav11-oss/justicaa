import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreVertical,
  Archive,
  Trash2,
  Download,
  Eye,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ConversationDetail } from "./ConversationDetail";
import { WelcomeHeader } from "./dashboard/WelcomeHeader";
import { StatsGrid } from "./dashboard/StatsGrid";
import { TypewriterLoader } from "./loaders/TypewriterLoader";

interface Conversation {
  id: string;
  title: string;
  legal_category: string;
  status: string;
  created_at: string;
}

interface LegalDocument {
  id: string;
  title: string;
  document_type: string;
  status: string;
  content: any;
  created_at: string;
}

interface LegalMatter {
  id: string;
  title: string;
  matter_type: string;
  status: string;
  priority: string;
  deadline_date: string | null;
  created_at: string;
}

export function UserDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [archivedConversations, setArchivedConversations] = useState<
    Conversation[]
  >([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [matters, setMatters] = useState<LegalMatter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState("conversations");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data: conversationsData } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: archivedData } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("status", "archived")
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: documentsData } = await supabase
        .from("legal_documents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      const { data: mattersData } = await supabase
        .from("legal_matters")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      setConversations(conversationsData || []);
      setArchivedConversations(archivedData || []);
      setDocuments(documentsData || []);
      setMatters(mattersData || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: t('common.error'),
        description: "Failed to load your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .insert([
          {
            user_id: user?.id,
            title: t('dashboard.newConversation'),
            legal_category: "general",
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: t('dashboard.newConversation'),
        description: t('dashboard.newConversationToast'),
      });

      fetchUserData();
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: t('common.error'),
        description: "Failed to create new conversation.",
        variant: "destructive",
      });
    }
  };

  const archiveConversation = async (conversationId: string) => {
    try {
      await supabase
        .from("chat_conversations")
        .update({ status: "archived" })
        .eq("id", conversationId);
      toast({
        title: t('dashboard.archive'),
        description: t('dashboard.archivedToast'),
      });
      fetchUserData();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "Failed to archive conversation.",
        variant: "destructive",
      });
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await supabase
        .from("chat_conversations")
        .delete()
        .eq("id", conversationId);
      toast({
        title: t('dashboard.delete'),
        description: t('dashboard.deletedToast'),
      });
      fetchUserData();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "Failed to delete conversation.",
        variant: "destructive",
      });
    }
  };

  const restoreConversation = async (conversationId: string) => {
    try {
      await supabase
        .from("chat_conversations")
        .update({ status: "active" })
        .eq("id", conversationId);
      toast({
        title: t('dashboard.restore'),
        description: t('dashboard.restoredToast'),
      });
      fetchUserData();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "Failed to restore conversation.",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = (doc: LegalDocument) => {
    // ... (implementation remains the same)
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300";
    }
  };

  const ConversationActions = ({ conversation, isArchived = false }: { conversation: Conversation; isArchived?: boolean; }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleConversationClick(conversation.id)}>
          <Eye className="h-4 w-4 mr-2" /> {t('dashboard.viewDetails')}
        </DropdownMenuItem>
        {!isArchived ? (
          <DropdownMenuItem onClick={() => archiveConversation(conversation.id)}>
            <Archive className="h-4 w-4 mr-2" /> {t('dashboard.archive')}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => restoreConversation(conversation.id)}>
            <Archive className="h-4 w-4 mr-2" /> {t('dashboard.restore')}
          </DropdownMenuItem>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" /> {t('dashboard.delete')}
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('dashboard.delete')} {t('dashboard.conversations')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('dashboard.areYouSure')} {t('dashboard.noUndo')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteConversation(conversation.id)}>
                {t('dashboard.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-8">
        <TypewriterLoader />
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  if (selectedConversationId) {
    return (
      <ConversationDetail
        conversationId={selectedConversationId}
        onBack={() => setSelectedConversationId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader
        name={user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
        onNewConversation={createNewConversation}
      />

      <StatsGrid
        conversationsCount={conversations.length}
        archivedCount={archivedConversations.length}
        documentsCount={documents.length}
        mattersCount={matters.filter((m) => m.status === "active").length}
      />

      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="conversations">{t('dashboard.conversations')}</TabsTrigger>
              <TabsTrigger value="archived">{t('dashboard.archived')}</TabsTrigger>
              <TabsTrigger value="documents">{t('dashboard.documentsTab')}</TabsTrigger>
              <TabsTrigger value="matters">{t('dashboard.mattersTab')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab}>
            <TabsContent value="conversations">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.table.title')}</TableHead>
                    <TableHead>{t('dashboard.table.category')}</TableHead>
                    <TableHead>{t('dashboard.table.date')}</TableHead>
                    <TableHead>{t('dashboard.table.status')}</TableHead>
                    <TableHead className="text-right">{t('dashboard.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversations.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell><Badge variant="outline">{c.legal_category}</Badge></TableCell>
                      <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      <TableCell><Badge className={getStatusColor(c.status)}>{c.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <ConversationActions conversation={c} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="archived">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.table.title')}</TableHead>
                    <TableHead>{t('dashboard.table.category')}</TableHead>
                    <TableHead>{t('dashboard.table.date')}</TableHead>
                    <TableHead>{t('dashboard.table.status')}</TableHead>
                    <TableHead className="text-right">{t('dashboard.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archivedConversations.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.title}</TableCell>
                      <TableCell><Badge variant="outline">{c.legal_category}</Badge></TableCell>
                      <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                      <TableCell><Badge className={getStatusColor(c.status)}>{c.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <ConversationActions conversation={c} isArchived />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="documents">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.table.title')}</TableHead>
                    <TableHead>{t('dashboard.table.type')}</TableHead>
                    <TableHead>{t('dashboard.table.date')}</TableHead>
                    <TableHead>{t('dashboard.table.status')}</TableHead>
                    <TableHead className="text-right">{t('dashboard.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.title}</TableCell>
                      <TableCell><Badge variant="outline">{d.document_type}</Badge></TableCell>
                      <TableCell>{new Date(d.created_at).toLocaleDateString()}</TableCell>
                      <TableCell><Badge className={getStatusColor(d.status)}>{d.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => downloadDocument(d)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="matters">
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4" />
                <p>{t('dashboard.mattersComingSoon')}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}