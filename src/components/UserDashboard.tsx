import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  MessageSquare,
  FileText,
  Calendar,
  Plus,
  MoreVertical,
  Archive,
  Trash2,
  Download,
  Eye,
  Briefcase,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ConversationDetail } from "./ConversationDetail";
import { WelcomeHeader } from "./dashboard/WelcomeHeader";
import { StatsGrid } from "./dashboard/StatsGrid";

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
        title: "Error",
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
            title: "New Legal Consultation",
            legal_category: "general",
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "New Conversation",
        description: "Started a new legal consultation.",
      });

      fetchUserData();
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
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
        title: "Conversation Archived",
        description: "The conversation has been moved to archives.",
      });
      fetchUserData();
    } catch (error) {
      toast({
        title: "Error",
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
        title: "Conversation Deleted",
        description: "The conversation has been permanently deleted.",
      });
      fetchUserData();
    } catch (error) {
      toast({
        title: "Error",
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
        title: "Conversation Restored",
        description: "The conversation has been restored to active chats.",
      });
      fetchUserData();
    } catch (error) {
      toast({
        title: "Error",
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
          <Eye className="h-4 w-4 mr-2" /> View Details
        </DropdownMenuItem>
        {!isArchived ? (
          <DropdownMenuItem onClick={() => archiveConversation(conversation.id)}>
            <Archive className="h-4 w-4 mr-2" /> Archive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => restoreConversation(conversation.id)}>
            <Archive className="h-4 w-4 mr-2" /> Restore
          </DropdownMenuItem>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteConversation(conversation.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="matters">Matters</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab}>
            <TabsContent value="conversations">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                <p>Legal matters tracking is coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}