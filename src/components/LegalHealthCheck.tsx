import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, File, ShieldCheck, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface AnalysisReport {
  riskScore: number;
  summary: string;
  flaggedClauses: {
    clause: string;
    reason: string;
    severity: 'High' | 'Medium' | 'Low';
  }[];
}

const readFileAsText = (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (file.type === 'application/pdf') {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (!event.target?.result) return reject('Failed to read file');
          const pdf = await pdfjsLib.getDocument({ data: event.target.result as ArrayBuffer }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => ('str' in item ? item.str : '')).join(' ') + '\n';
          }
          resolve(text);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (!event.target?.result) return reject('Failed to read file');
          const result = await mammoth.extractRawText({ arrayBuffer: event.target.result as ArrayBuffer });
          resolve(result.value);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error('Unsupported file type. Please upload a .pdf or .docx file.'));
    }
  });
};

const FileUploader = ({ onFileSelect, acceptedTypes, children }: { onFileSelect: (file: File) => void, acceptedTypes: string, children: React.ReactNode }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div
      className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
      onClick={() => inputRef.current?.click()}
    >
      <input type="file" ref={inputRef} onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} accept={acceptedTypes} className="hidden" />
      {children}
    </div>
  );
};

const getRiskScoreColor = (score: number) => {
  if (score > 75) return "text-red-500";
  if (score > 50) return "text-yellow-500";
  return "text-green-500";
};

const getSeverityBadge = (severity: 'High' | 'Medium' | 'Low') => {
  switch (severity) {
    case 'High': return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    case 'Medium': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    case 'Low': return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
  }
};

export const LegalHealthCheck = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setFile(selectedFile);
      setReport(null);
    } else {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a .pdf or .docx file.",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setReport(null);
    try {
      const text = await readFileAsText(file);
      if (text.trim().length < 50) {
        throw new Error("Could not extract sufficient text from the document. It might be an image-based PDF or empty.");
      }

      const { data, error } = await supabase.functions.invoke('legal-health-check', {
        body: { text },
      });

      if (error) throw error;
      
      if (data.riskScore === undefined || !data.summary || !Array.isArray(data.flaggedClauses)) {
        throw new Error("The AI returned an invalid report format. Please try again.");
      }

      setReport(data as AnalysisReport);
      toast({ title: "Analysis Complete!" });

    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold">AI Legal Health Check</h2>
        <p className="text-muted-foreground mt-2">
          Instantly analyze your legal documents for risks and clarity.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <FileUploader onFileSelect={handleFileSelect} acceptedTypes=".pdf,.docx">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-semibold text-lg">Drag & Drop Your Document Here, or Click to Upload</p>
            <p className="text-sm text-muted-foreground mt-1">Supported file types: .pdf, .docx</p>
          </FileUploader>
          {file && (
            <div className="mt-4 text-center">
              <p className="text-sm font-medium flex items-center justify-center gap-2">
                <File className="h-4 w-4" /> {file.name}
              </p>
              <Button onClick={handleAnalyze} disabled={loading} className="mt-4">
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                {loading ? "Analyzing..." : "Perform Health Check"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {report && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle>Analysis Report</CardTitle>
                <CardDescription>Here is the health check for your document.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 text-center">
                    <h4 className="font-semibold text-muted-foreground">Overall Risk Score</h4>
                    <p className={`text-6xl font-bold ${getRiskScoreColor(report.riskScore)}`}>{report.riskScore}<span className="text-2xl">/100</span></p>
                    <p className="text-sm text-muted-foreground">Lower is better. This score reflects potential risks.</p>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-2">AI Summary</h4>
                    <p className="text-sm text-muted-foreground">{report.summary}</p>
                  </Card>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Flagged Clauses</h4>
                  <div className="space-y-4">
                    {report.flaggedClauses.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                        <AlertTriangle className={`h-5 w-5 mt-1 ${getRiskScoreColor(item.severity === 'High' ? 80 : item.severity === 'Medium' ? 60 : 40)}`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold">{item.clause}</h5>
                            <Badge className={getSeverityBadge(item.severity)}>{item.severity} Risk</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="space-y-2">
          <div className="mx-auto bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center"><span className="font-bold text-lg">1</span></div>
          <h4 className="font-semibold">Upload</h4>
          <p className="text-sm text-muted-foreground">Securely upload your rental agreement, employment contract, or any legal PDF/Word file.</p>
        </div>
        <div className="space-y-2">
          <div className="mx-auto bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center"><span className="font-bold text-lg">2</span></div>
          <h4 className="font-semibold">Analyze</h4>
          <p className="text-sm text-muted-foreground">Our AI, trained on Indian law, will perform a health check in seconds.</p>
        </div>
        <div className="space-y-2">
          <div className="mx-auto bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center"><span className="font-bold text-lg">3</span></div>
          <h4 className="font-semibold">Review</h4>
          <p className="text-sm text-muted-foreground">Get your detailed report with flagged clauses, risk score, and plain-language explanations.</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-muted-foreground pt-4">
        <Lock className="h-4 w-4" />
        <p className="text-xs">Your documents are encrypted and confidential. We never share your data.</p>
      </div>
    </div>
  );
};