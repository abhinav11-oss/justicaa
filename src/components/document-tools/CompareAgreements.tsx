import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, GitCompareArrows } from "lucide-react";

export const CompareAgreements = () => {
  const [doc1, setDoc1] = useState("");
  const [doc2, setDoc2] = useState("");
  const [comparison, setComparison] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCompare = async () => {
    if (!doc1.trim() || !doc2.trim()) {
      toast({ title: "Please paste text for both documents.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setComparison("");
    try {
      const prompt = `Please compare the following two legal documents and highlight the key differences, similarities, and potential conflicts.

Document 1:
---
${doc1}
---

Document 2:
---
${doc2}
---

Provide a detailed comparison.`;
      const { data, error } = await supabase.functions.invoke('ai-legal-chat-hf', {
        body: { message: prompt }
      });
      if (error) throw error;
      setComparison(data.response);
    } catch (error) {
      console.error("Error comparing documents:", error);
      toast({ title: "Comparison failed.", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GitCompareArrows className="h-5 w-5 mr-2" />
          Compare Agreements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea
            placeholder="Paste Document 1 text here..."
            value={doc1}
            onChange={(e) => setDoc1(e.target.value)}
            className="min-h-48"
            disabled={isLoading}
          />
          <Textarea
            placeholder="Paste Document 2 text here..."
            value={doc2}
            onChange={(e) => setDoc2(e.target.value)}
            className="min-h-48"
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleCompare} disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Compare Documents
        </Button>
        {comparison && (
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>Comparison Result</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{comparison}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};