import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Download } from "lucide-react";
import jsPDF from 'jspdf';
import htmlDocx from 'html-docx-js';

export const CreateAgreementPro = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedDocument, setGeneratedDocument] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please enter a description for the document.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedDocument("");
    try {
      const fullPrompt = `Generate a professional legal document based on the following request. Ensure it is well-formatted and legally sound for Indian jurisdiction.
Request: "${prompt}"`;
      const { data, error } = await supabase.functions.invoke('ai-legal-chat-hf', {
        body: { message: fullPrompt }
      });
      if (error) throw error;
      setGeneratedDocument(data.response);
    } catch (error) {
      console.error("Error generating document:", error);
      toast({ title: "Generation failed.", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(generatedDocument, 180);
    pdf.text(lines, 10, 10);
    pdf.save("Justicaa_AI_Document.pdf");
  };

  const downloadWordDocument = () => {
    const content = `<!DOCTYPE html><html><head><title>Document</title></head><body>${generatedDocument.replace(/\n/g, '<br>')}</body></html>`;
    const blob = htmlDocx.asBlob(content);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Justicaa_AI_Document.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Create an Agreement (AI)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe the agreement you want to create. For example: 'A simple non-disclosure agreement between two companies for a new project.'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-24"
          disabled={isLoading}
        />
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Generate Document
        </Button>
        {generatedDocument && (
          <Card className="bg-muted">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Document</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={generatePDF}><Download className="h-4 w-4 mr-2" /> PDF</Button>
                <Button variant="outline" size="sm" onClick={downloadWordDocument}><Download className="h-4 w-4 mr-2" /> Word</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea value={generatedDocument} onChange={(e) => setGeneratedDocument(e.target.value)} className="min-h-96 bg-background" />
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};