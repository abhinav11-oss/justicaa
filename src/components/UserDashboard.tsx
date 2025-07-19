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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
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
  TrendingUp,
  Clock,
  Briefcase,
  ArrowUpRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ConversationDetail } from "./ConversationDetail";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

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
      const { error } = await supabase
        .from("chat_conversations")
        .update({ status: "archived" })
        .eq("id", conversationId);

      if (error) throw error;

      toast({
        title: "Conversation Archived",
        description: "The conversation has been moved to archives.",
      });

      fetchUserData();
    } catch (error) {
      console.error("Error archiving conversation:", error);
      toast({
        title: "Error",
        description: "Failed to archive conversation.",
        variant: "destructive",
      });
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("chat_conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;

      toast({
        title: "Conversation Deleted",
        description: "The conversation has been permanently deleted.",
      });

      fetchUserData();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation.",
        variant: "destructive",
      });
    }
  };

  const restoreConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("chat_conversations")
        .update({ status: "active" })
        .eq("id", conversationId);

      if (error) throw error;

      toast({
        title: "Conversation Restored",
        description: "The conversation has been restored to active chats.",
      });

      fetchUserData();
    } catch (error) {
      console.error("Error restoring conversation:", error);
      toast({
        title: "Error",
        description: "Failed to restore conversation.",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = (doc: LegalDocument) => {
    try {
      let content = "";
      let fileName = "";
      let mimeType = "";

      if (typeof doc.content === "string") {
        content = doc.content;
      } else if (typeof doc.content === "object" && doc.content !== null) {
        if (doc.content.html) {
          content = doc.content.html;
          fileName = `${doc.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
          mimeType = "text/html";
        } else {
          content = JSON.stringify(doc.content, null, 2);
          fileName = `${doc.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
          mimeType = "application/json";
        }
      } else {
        content = String(doc.content);
        fileName = `${doc.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
        mimeType = "text/plain";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Document Downloaded",
        description: `${doc.title} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400";
      case "completed":
        return "bg-primary/10 text-primary";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400";
      case "draft":
        return "bg-muted text-muted-foreground";
      case "archived":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400";
      case "low":
        return "bg-green-500/10 text-green-400";
      case "urgent":
        return "bg-red-600/20 text-red-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const ConversationActions = ({
    conversation,
    isArchived = false,
  }: {
    conversation: Conversation;
    isArchived?: boolean;
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleConversationClick(conversation.id)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        {!isArchived ? (
          <DropdownMenuItem
            onClick={() => archiveConversation(conversation.id)}
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => restoreConversation(conversation.id)}
          >
            <Archive className="h-4 w-4 mr-2" />
            Restore
          </DropdownMenuItem>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this conversation? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConversation(conversation.id)}
              >
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (selectedConversationId) {
    return (
      <div className="space-y-6">
        <ConversationDetail
          conversationId={selectedConversationId}
          onBack={() => setSelectedConversationId(null)}
        />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden bg-card">
          <CardContent className="relative p-8 z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-foreground">
                  Hello,{" "}
                  {user?.user_metadata?.full_name ||
                    user?.email?.split("@")[0] ||
                    "User"}
                  ! 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                  Ready to tackle your legal matters? Your AI assistant is here
                  to help.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={createNewConversation}
                  className="gradient-primary text-white shadow-lg px-6 py-3"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start New Consultation
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: "Active Conversations",
            value: conversations.length,
            icon: MessageSquare,
            trend: "+12%",
          },
          {
            title: "Archived Chats",
            value: archivedConversations.length,
            icon: Archive,
            trend: "+8%",
          },
          {
            title: "Documents Generated",
            value: documents.length,
            icon: FileText,
            trend: "+25%",
          },
          {
            title: "Active Matters",
            value: matters.filter((m) => m.status === "active").length,
            icon: Briefcase,
            trend: "+5%",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-card relative overflow-hidden group card-glow">
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <div className="flex items-center text-xs text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-card">
          <CardHeader>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="conversations">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Conversations
                </TabsTrigger>
                <TabsTrigger value="archived">
                  <Archive className="h-4 w-4 mr-2" />
                  Archived
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="matters">
                  <Calendar className="h-4 w-4 mr-2" />
                  Matters
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsContent value="conversations" className="space-y-4">
                {conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      No conversations yet
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Start your first legal consultation to get personalized
                      advice
                    </p>
                    <Button
                      onClick={createNewConversation}
                      className="gradient-primary text-white"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Your First Consultation
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {conversations.map((conversation) => (
                      <Card key={conversation.id} className="hover:border-primary/30 transition-colors duration-300">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() =>
                                handleConversationClick(conversation.id)
                              }
                            >
                              <h4 className="font-semibold text-foreground">
                                {conversation.title}
                              </h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {conversation.legal_category}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge
                                className={getStatusColor(
                                  conversation.status,
                                )}
                              >
                                {conversation.status}
                              </Badge>
                              <ConversationActions
                                conversation={conversation}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="archived" className="space-y-4">
                {archivedConversations.length === 0 ? (
                  <div className="text-center py-12">
                    <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      No archived conversations
                    </h4>
                    <p className="text-muted-foreground">
                      Completed conversations will appear here for future
                      reference
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {archivedConversations.map((conversation) => (
                      <Card key={conversation.id} className="hover:border-primary/30 transition-colors duration-300">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() =>
                                handleConversationClick(conversation.id)
                              }
                            >
                              <h4 className="font-semibold text-foreground">
                                {conversation.title}
                              </h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {conversation.legal_category}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge
                                className={getStatusColor(
                                  conversation.status,
                                )}
                              >
                                {conversation.status}
                              </Badge>
                              <ConversationActions
                                conversation={conversation}
                                isArchived={true}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      No documents yet
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Create professional legal documents with AI assistance
                    </p>
                    <Button className="gradient-primary text-white">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Your First Document
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {documents.map((document) => (
                      <Card key={document.id} className="hover:border-primary/30 transition-colors duration-300">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">
                                {document.title}
                              </h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {document.document_type}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge
                                className={getStatusColor(document.status)}
                              >
                                {document.status}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadDocument(document)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="matters" className="space-y-4">
                {matters.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      No legal matters yet
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Add your first case to start tracking legal matters
                    </p>
                    <Button className="gradient-primary text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Case
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {matters.map((matter) => (
                      <Card key={matter.id} className="hover:border-primary/30 transition-colors duration-300">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">
                                {matter.title}
                              </h4>
                              <p className="text-sm text-muted-foreground capitalize">
                                {matter.matter_type}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Badge
                                className={getStatusColor(matter.status)}
                              >
                                {matter.status}
                              </Badge>
                              <Badge
                                className={getPriorityColor(matter.priority)}
                              >
                                {matter.priority}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}