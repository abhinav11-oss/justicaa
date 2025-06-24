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
  Users,
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

  // Animation variants (simplified)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Reduced stagger
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Reduced y translation
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }, // Reduced duration
    },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.01, // Reduced scale
      transition: { duration: 0.15 }, // Reduced duration
    },
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch active conversations
      const { data: conversationsData } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch archived conversations
      const { data: archivedData } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("status", "archived")
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch documents
      const { data: documentsData } = await supabase
        .from("legal_documents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      // Fetch legal matters
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
        // Check if it's HTML content
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

      // Create and download the file
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

  // Show conversation detail if selected
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
      {/* Welcome Section with Enhanced Gradients and Animations (simplified) */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden">
          {/* Multiple Background Layers */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-primary/3 to-transparent"></div>
            <img
              src="https://images.pexels.com/photos/6077797/pexels-photo-6077797.jpeg"
              alt="Professional legal workspace"
              className="w-full h-full object-cover opacity-5"
            />
          </div>

          {/* Animated Gradient Orbs (simplified) */}
          <motion.div
            className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" // Reduced size and blur
            animate={{
              scale: [1, 1.1, 1], // Reduced scale
              opacity: [0.2, 0.4, 0.2], // Reduced opacity range
            }}
            transition={{
              duration: 3, // Reduced duration
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/15 to-transparent rounded-full blur-xl" // Reduced size and blur
            animate={{
              scale: [1, 1.2, 1], // Reduced scale
              opacity: [0.1, 0.3, 0.1], // Reduced opacity range
            }}
            transition={{
              duration: 4, // Reduced duration
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5, // Reduced delay
            }}
          />

          <CardContent className="relative p-8 z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ x: -10, opacity: 0 }} // Reduced x translation
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }} // Reduced delay
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2, // Reduced duration
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-5 w-5 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium text-primary">
                    Welcome back
                  </span>
                </motion.div>
                <motion.h1
                  className="text-3xl font-bold text-foreground"
                  initial={{ y: 10, opacity: 0 }} // Reduced y translation
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.2 }} // Reduced delay, adjusted bounce
                >
                  Hello,{" "}
                  {user?.user_metadata?.full_name ||
                    user?.email?.split("@")[0] ||
                    "User"}
                  ! 👋
                </motion.h1>
                <motion.p
                  className="text-muted-foreground text-lg"
                  initial={{ y: 10, opacity: 0 }} // Reduced y translation
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }} // Reduced delay
                >
                  Ready to tackle your legal matters? Your AI assistant is here
                  to help.
                </motion.p>
              </div>
              <motion.div
                initial={{ scale: 0.8, rotate: -90 }} // Reduced rotate
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", bounce: 0.2 }} // Reduced delay, adjusted bounce
                whileHover={{ scale: 1.02, y: -1 }} // Reduced hover effect
                whileTap={{ scale: 0.98 }} // Reduced tap effect
              >
                <Button
                  onClick={createNewConversation}
                  className="gradient-primary text-white border-0 shadow-lg px-6 py-3 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    animate={{ x: [-50, 50] }} // Reduced x range
                    transition={{
                      duration: 1.5, // Reduced duration
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <Zap className="h-5 w-5 mr-2 relative z-10" />
                  <span className="relative z-10">Start New Consultation</span>
                  <ArrowUpRight className="h-4 w-4 ml-2 relative z-10" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Stats Grid with Rolling Animations (simplified) */}
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
            color: "from-primary to-primary/80",
            bg: "bg-primary/10",
            border: "border-primary/20",
          },
          {
            title: "Archived Chats",
            value: archivedConversations.length,
            icon: Archive,
            trend: "+8%",
            color: "from-purple-500 to-purple-600",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
          },
          {
            title: "Documents Generated",
            value: documents.length,
            icon: FileText,
            trend: "+25%",
            color: "from-green-500 to-green-600",
            bg: "bg-green-500/10",
            border: "border-green-500/20",
          },
          {
            title: "Active Matters",
            value: matters.filter((m) => m.status === "active").length,
            icon: Briefcase,
            trend: "+5%",
            color: "from-orange-500 to-orange-600",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }} // Simplified animation
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5, // Reduced duration
              delay: 0.3 + index * 0.08, // Reduced delay
            }}
            whileHover={{
              scale: 1.02, // Reduced scale
            }}
          >
            <Card
              className={`${stat.bg} backdrop-blur-sm relative overflow-hidden group`}
            >
              {/* Animated Background Gradient (simplified) */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.p
                      className="text-sm font-medium text-muted-foreground"
                      initial={{ opacity: 0, x: -5 }} // Reduced x translation
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.08 }} // Reduced delay
                    >
                      {stat.title}
                    </motion.p>
                    <div className="flex items-center gap-2 mt-2">
                      <motion.p
                        className="text-3xl font-bold text-foreground"
                        initial={{ scale: 0.8, opacity: 0 }} // Simplified animation
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.6 + index * 0.08, // Reduced delay
                          type: "spring",
                          bounce: 0.3, // Reduced bounce
                        }}
                      >
                        {stat.value}
                      </motion.p>
                      <motion.div
                        className="flex items-center text-xs text-green-400"
                        initial={{ opacity: 0, y: 5 }} // Reduced y translation
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.08 }} // Reduced delay
                      >
                        <motion.div
                          animate={{ y: [0, -1, 0] }} // Reduced y range
                          transition={{
                            duration: 1.5, // Reduced duration
                            repeat: Infinity,
                            delay: index * 0.2, // Reduced delay
                          }}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                        </motion.div>
                        {stat.trend}
                      </motion.div>
                    </div>
                  </div>
                  <motion.div
                    className={`bg-gradient-to-br ${stat.color} p-3 rounded-2xl shadow-lg relative overflow-hidden`}
                    whileHover={{ scale: 1.05 }} // Reduced scale, removed rotate
                    transition={{ duration: 0.2 }} // Reduced duration
                  >
                    <stat.icon className="h-6 w-6 text-white relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3, // Reduced duration
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.3, // Reduced delay
                      }}
                    />
                  </motion.div>
                </div>
              </CardContent>

              {/* Shimmer Effect (simplified) */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" // Reduced opacity
                animate={{ x: [-50, 150] }} // Reduced x range
                transition={{
                  duration: 2, // Reduced duration
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4, // Reduced delay
                }}
              />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Main Content */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Legal Workspace</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage conversations, documents, and legal matters in one
                  place
                </CardDescription>
              </div>
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 bg-muted/50 backdrop-blur-sm">
                <TabsTrigger
                  value="conversations"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Conversations
                </TabsTrigger>
                <TabsTrigger
                  value="archived"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archived
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger
                  value="matters"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white"
                >
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
              <TabsContent value="conversations" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Recent Conversations
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your latest legal consultations
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={createNewConversation}
                    className="gradient-primary text-white border-0 shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </div>

                {conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="relative w-48 h-32 mx-auto mb-6 opacity-20">
                      <img
                        src="https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg"
                        alt="Team collaboration"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
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
                      className="gradient-primary text-white border-0"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Your First Consultation
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {conversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 10 }} // Reduced y translation
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} // Reduced delay
                        whileHover={{ scale: 1.005 }} // Reduced scale
                        className="group"
                      >
                        <Card className="hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() =>
                                  handleConversationClick(conversation.id)
                                }
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                      {conversation.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {conversation.legal_category}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {new Date(
                                    conversation.created_at,
                                  ).toLocaleDateString()}
                                </div>
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="archived" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Archive className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Archived Conversations
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Previously completed consultations
                      </p>
                    </div>
                  </div>
                </div>

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
                    {archivedConversations.map((conversation, index) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 10 }} // Reduced y translation
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} // Reduced delay
                        whileHover={{ scale: 1.005 }} // Reduced scale
                        className="group"
                      >
                        <Card className="hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() =>
                                  handleConversationClick(conversation.id)
                                }
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                    <Archive className="h-5 w-5 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">
                                      {conversation.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {conversation.legal_category}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {new Date(
                                    conversation.created_at,
                                  ).toLocaleDateString()}
                                </div>
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
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Legal Documents
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Generated contracts and legal papers
                      </p>
                    </div>
                  </div>
                  <Button className="gradient-primary text-white border-0 shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                  </Button>
                </div>

                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="relative w-48 h-32 mx-auto mb-6 opacity-20">
                      <img
                        src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg"
                        alt="Contract signing"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      No documents yet
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Create professional legal documents with AI assistance
                    </p>
                    <Button className="gradient-primary text-white border-0">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Your First Document
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {documents.map((document, index) => (
                      <motion.div
                        key={document.id}
                        initial={{ opacity: 0, y: 10 }} // Reduced y translation
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} // Reduced delay
                        whileHover={{ scale: 1.005 }} // Reduced scale
                        className="group"
                      >
                        <Card className="hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-green-500" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">
                                      {document.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {document.document_type}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {new Date(
                                    document.created_at,
                                  ).toLocaleDateString()}
                                </div>
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
                                  className="text-foreground hover:bg-muted"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="matters" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        Legal Matters
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Track your ongoing legal cases
                      </p>
                    </div>
                  </div>
                  <Button className="gradient-primary text-white border-0 shadow-md">
                    <Plus className="h-4 w-4 mr-2" />
                    New Matter
                  </Button>
                </div>

                {matters.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <h4 className="text-lg font-medium text-foreground mb-2">
                      No legal matters yet
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      Add your first case to start tracking legal matters
                    </p>
                    <Button className="gradient-primary text-white border-0">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Case
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {matters.map((matter, index) => (
                      <motion.div
                        key={matter.id}
                        initial={{ opacity: 0, y: 10 }} // Reduced y translation
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }} // Reduced delay
                        whileHover={{ scale: 1.005 }} // Reduced scale
                        className="group"
                      >
                        <Card className="hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-orange-500" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">
                                      {matter.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {matter.matter_type}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  {matter.deadline_date && (
                                    <div className="flex items-center gap-2 text-xs text-destructive">
                                      <Calendar className="h-3 w-3" />
                                      Deadline:{" "}
                                      {new Date(
                                        matter.deadline_date,
                                      ).toLocaleDateString()}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    Created:{" "}
                                    {new Date(
                                      matter.created_at,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2">
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
                      </motion.div>
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