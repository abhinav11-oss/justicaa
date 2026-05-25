import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, File, ShieldCheck, Lock, Loader2, AlertTriangle, CheckCircle, XCircle, FileWarning, Info, ThumbsUp, Scale } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FlaggedClause {
  clause: string;
  reason: string;
  severity: 'High' | 'Medium' | 'Low';
  recommendation?: string;
}

interface LegalReport {
  isLegalDocument: true;
  documentType: string;
  riskScore: number;
  summary: string;
  keyDetails?: {
    parties?: string;
    duration?: string;
    value?: string;
  };
  flaggedClauses: FlaggedClause[];
  positivePoints?: string[];
  overallVerdict?: string;
}

interface NonLegalReport {
  isLegalDocument: false;
  documentType: string;
  message: string;
}

type AnalysisResult = LegalReport | NonLegalReport;

const readFileAsText = (file: File): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
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
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) return reject('Failed to read file');
        resolve(event.target.result as string);
      };
      reader.readAsText(file);
    } else {
      reject(new Error('Unsupported file type. Please upload a .pdf, .docx, or .txt file.'));
    }
  });
};

const FileUploader = ({ onFileSelect, acceptedTypes, children }: { onFileSelect: (file: File) => void, acceptedTypes: string, children: React.ReactNode }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
        isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'hover:border-primary hover:bg-muted/30'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) onFileSelect(e.dataTransfer.files[0]);
      }}
    >
      <input type="file" ref={inputRef} onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} accept={acceptedTypes} className="hidden" />
      {children}
    </div>
  );
};

const getRiskScoreColor = (score: number) => {
  if (score > 75) return "text-red-500";
  if (score > 50) return "text-orange-500";
  if (score > 25) return "text-yellow-500";
  return "text-green-500";
};

const getRiskBgColor = (score: number) => {
  if (score > 75) return "bg-red-500";
  if (score > 50) return "bg-orange-500";
  if (score > 25) return "bg-yellow-500";
  return "bg-green-500";
};

const getSeverityBadge = (severity: 'High' | 'Medium' | 'Low') => {
  switch (severity) {
    case 'High': return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
    case 'Medium': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    case 'Low': return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
  }
};

const getVerdictStyle = (verdict: string) => {
  if (verdict.includes('Safe')) return { icon: CheckCircle, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" };
  if (verdict.includes('Do Not')) return { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" };
  return { icon: AlertTriangle, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" };
};

export const LegalHealthCheck = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setReport(null);
    } else {
      toast({
        title: "Unsupported File Type",
        description: "Please upload a .pdf, .docx, or .txt file.",
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
        throw new Error("Could not extract enough text from the document. It might be an image-based PDF or empty.");
      }

      const { data, error } = await supabase.functions.invoke('legal-health-check', {
        body: { text },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setReport(data as AnalysisResult);

      if (data.isLegalDocument === false) {
        toast({ title: "⚠️ Not a Legal Document", description: data.message, variant: "destructive" });
      } else {
        toast({ title: "✅ Analysis Complete!" });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const handleReset = () => {
    setFile(null);
    setReport(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold">AI Legal Health Check</h2>
        <p className="text-muted-foreground mt-2">
          Upload any document — our AI will detect if it's legal, then analyze it for risks.
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardContent className="p-6">
          <FileUploader onFileSelect={handleFileSelect} acceptedTypes=".pdf,.docx,.txt">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-semibold text-lg">Drag & Drop Your Document Here, or Click to Upload</p>
            <p className="text-sm text-muted-foreground mt-1">Supported: .pdf, .docx, .txt</p>
          </FileUploader>
          {file && (
            <div className="mt-4 text-center space-y-3">
              <p className="text-sm font-medium flex items-center justify-center gap-2">
                <File className="h-4 w-4" /> {file.name}
                <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleAnalyze} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                  {loading ? "AI is Analyzing..." : "Perform Health Check"}
                </Button>
                {!loading && (
                  <Button variant="outline" onClick={handleReset}>Clear</Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading Animation */}
      {loading && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div>
              <p className="font-semibold text-lg">Analyzing Your Document...</p>
              <p className="text-sm text-muted-foreground mt-1">AI is reading and checking every clause for risks</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <AnimatePresence>
        {report && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* NOT a legal document */}
            {report.isLegalDocument === false && (
              <Card className="border-orange-200 dark:border-orange-800">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <FileWarning className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold">Not a Legal Document</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {(report as NonLegalReport).message}
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    Detected as: {(report as NonLegalReport).documentType}
                  </Badge>
                  <div className="pt-2">
                    <Button onClick={handleReset} variant="outline">Upload a Different Document</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* IS a legal document — show full report */}
            {report.isLegalDocument === true && (() => {
              const legalReport = report as LegalReport;
              const verdictStyle = legalReport.overallVerdict ? getVerdictStyle(legalReport.overallVerdict) : null;
              const VerdictIcon = verdictStyle?.icon || Scale;

              return (
                <div className="space-y-6">
                  {/* Document Type & Verdict */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5 text-primary" />
                            Analysis Report
                          </CardTitle>
                          <CardDescription>
                            Document Type: <strong>{legalReport.documentType}</strong>
                          </CardDescription>
                        </div>
                        {legalReport.overallVerdict && verdictStyle && (
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${verdictStyle.bg}`}>
                            <VerdictIcon className={`h-5 w-5 ${verdictStyle.color}`} />
                            <span className={`font-semibold ${verdictStyle.color}`}>{legalReport.overallVerdict}</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Score + Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 text-center">
                      <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide">Risk Score</h4>
                      <p className={`text-6xl font-bold mt-2 ${getRiskScoreColor(legalReport.riskScore)}`}>
                        {legalReport.riskScore}<span className="text-2xl">/100</span>
                      </p>
                      <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${getRiskBgColor(legalReport.riskScore)}`} style={{ width: `${legalReport.riskScore}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">Lower is better</p>
                    </Card>

                    <Card className="p-6 md:col-span-2">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-2">AI Summary</h4>
                      <p className="text-sm leading-relaxed">{legalReport.summary}</p>
                    </Card>
                  </div>

                  {/* Key Details */}
                  {legalReport.keyDetails && (legalReport.keyDetails.parties || legalReport.keyDetails.duration || legalReport.keyDetails.value) && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Info className="h-4 w-4" /> Key Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {legalReport.keyDetails.parties && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Parties</p>
                              <p className="text-sm font-medium mt-1">{legalReport.keyDetails.parties}</p>
                            </div>
                          )}
                          {legalReport.keyDetails.duration && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                              <p className="text-sm font-medium mt-1">{legalReport.keyDetails.duration}</p>
                            </div>
                          )}
                          {legalReport.keyDetails.value && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Value</p>
                              <p className="text-sm font-medium mt-1">{legalReport.keyDetails.value}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Flagged Clauses */}
                  {legalReport.flaggedClauses && legalReport.flaggedClauses.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Flagged Clauses ({legalReport.flaggedClauses.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {legalReport.flaggedClauses.map((item, index) => (
                          <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-semibold text-sm">{item.clause}</h5>
                              <Badge className={`flex-shrink-0 ${getSeverityBadge(item.severity)}`}>{item.severity}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.reason}</p>
                            {item.recommendation && (
                              <div className="flex items-start gap-2 text-sm bg-primary/5 rounded-md px-3 py-2 mt-1">
                                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span><strong>Recommendation:</strong> {item.recommendation}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Positive Points */}
                  {legalReport.positivePoints && legalReport.positivePoints.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-green-500" />
                          Positive Points
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {legalReport.positivePoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Analyze another */}
                  <div className="text-center">
                    <Button variant="outline" onClick={handleReset}>Analyze Another Document</Button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works — only show when no report */}
      {!report && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="mx-auto bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center"><span className="font-bold text-lg">1</span></div>
            <h4 className="font-semibold">Upload</h4>
            <p className="text-sm text-muted-foreground">Upload any document — rental agreement, contract, legal notice, or even a random file.</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center"><span className="font-bold text-lg">2</span></div>
            <h4 className="font-semibold">AI Detection</h4>
            <p className="text-sm text-muted-foreground">Our AI first detects if it's a legal document. Non-legal files are flagged immediately.</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center"><span className="font-bold text-lg">3</span></div>
            <h4 className="font-semibold">Full Report</h4>
            <p className="text-sm text-muted-foreground">Get risk score, flagged clauses, recommendations, and a clear verdict — sign or don't sign.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-muted-foreground pt-4">
        <Lock className="h-4 w-4" />
        <p className="text-xs">Your documents are encrypted and confidential. We never share your data.</p>
      </div>
    </div>
  );
};