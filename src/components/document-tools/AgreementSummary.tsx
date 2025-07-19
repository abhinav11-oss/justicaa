import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText } from "lucide-react";

export const AgreementSummary = () => {
  const [documentText, setDocumentText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!documentText.trim()) {
      toast({ title: "Please paste the document text.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setSummary("");
    try {
      const { data, error } = await supabase.functions.invoke('ai-legal-chat-hf', {
        body: { message: `Please provide a concise summary of the following legal document:\n\n${documentText}` }
      });
      if (error) throw error;
      setSummary(data.response);
    } catch (error) {
      console.error("Error summarizing document:", error);
      toast({ title: "Summarization failed.", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Agreement Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste your full agreement text here..."
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          className="min-h-48"
          disabled={isLoading}
        />
        <Button onClick={handleSummarize} disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Summarize Document
        </Button>
        {summary && (
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{summary}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};