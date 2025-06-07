import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, FileText, Calendar, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ConversationDetail } from './ConversationDetail';

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
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [matters, setMatters] = useState<LegalMatter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch conversations
      const { data: conversationsData } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch documents
      const { data: documentsData } = await supabase
        .from('legal_documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch legal matters
      const { data: mattersData } = await supabase
        .from('legal_matters')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setConversations(conversationsData || []);
      setDocuments(documentsData || []);
      setMatters(mattersData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createNewConversation = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([
          {
            user_id: user?.id,
            title: 'New Legal Consultation',
            legal_category: 'general',
            status: 'active'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "New Conversation",
        description: "Started a new legal consultation."
      });
      
      fetchUserData();
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation.",
        variant: "destructive"
      });
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show conversation detail if selected
  if (selectedConversationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Legal Dashboard</h1>
                  <p className="text-sm text-slate-600">Welcome back, {user?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <ConversationDetail 
            conversationId={selectedConversationId}
            onBack={() => setSelectedConversationId(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Legal Dashboard</h1>
                <p className="text-sm text-slate-600">Welcome back, {user?.email}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversations.filter(c => c.status === 'active').length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.filter(d => d.status === 'draft').length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Matters</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matters.filter(m => m.status === 'active').length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-xl">
          <CardHeader>
            <Tabs defaultValue="conversations" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100">
                <TabsTrigger value="conversations">Recent Conversations</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="matters">Legal Matters</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="conversations" className="w-full">
              <TabsContent value="conversations" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Conversations</h3>
                  <Button onClick={createNewConversation} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>
                </div>
                
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No conversations yet. Start your first legal consultation!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversations.map((conversation) => (
                      <div 
                        key={conversation.id} 
                        className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleConversationClick(conversation.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{conversation.title}</h4>
                            <p className="text-sm text-slate-600 capitalize">{conversation.legal_category}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(conversation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(conversation.status)}>
                            {conversation.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Legal Documents</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                  </Button>
                </div>
                
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No documents yet. Create your first legal document!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((document) => (
                      <div key={document.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{document.title}</h4>
                            <p className="text-sm text-slate-600 capitalize">{document.document_type}</p>
                            <p className="text-xs text-slate-400">
                              {new Date(document.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(document.status)}>
                            {document.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="matters" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Legal Matters</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Matter
                  </Button>
                </div>
                
                {matters.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>No legal matters yet. Add your first case!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matters.map((matter) => (
                      <div key={matter.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{matter.title}</h4>
                            <p className="text-sm text-slate-600 capitalize">{matter.matter_type}</p>
                            {matter.deadline_date && (
                              <p className="text-xs text-red-600">
                                Deadline: {new Date(matter.deadline_date).toLocaleDateString()}
                              </p>
                            )}
                            <p className="text-xs text-slate-400">
                              Created: {new Date(matter.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Badge className={getStatusColor(matter.status)}>
                              {matter.status}
                            </Badge>
                            <Badge className={getPriorityColor(matter.priority)}>
                              {matter.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}