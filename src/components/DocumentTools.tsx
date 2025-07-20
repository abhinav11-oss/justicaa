import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, GitCompareArrows, FilePlus, Languages, FileImage, ArrowLeft, Upload, Loader2, Download } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { templates, DocumentTemplate } from "@/data/document-templates";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { downloadAsPdf, downloadAsWord } from "@/lib/download";

type Tool = 'summary' | 'compare' | 'create' | 'translate' | 'ocr';

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'text/plain') {
      reject(new Error('Only .txt files are supported for this tool.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const readFileAsBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ data: base64Data, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ToolButton = ({ icon: Icon, title, description, pro, onClick }: { icon: React.ElementType, title: string, description: string, pro?: boolean, onClick: () => void }) => (
  <Card className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-300" onClick={onClick}>
    <CardContent className="p-6 flex items-center space-x-4">
      <div className="bg-primary/10 p-3 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">{title}</h3>
          {pro && <Badge className="bg-yellow-400 text-black">PRO</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const FileUploader = ({ onFileSelect, acceptedTypes, children, disabled }: { onFileSelect: (file: File) => void, acceptedTypes: string, children: React.ReactNode, disabled?: boolean }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${disabled ? 'bg-muted/50 cursor-not-allowed' : 'hover:border-primary'}`}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input type="file" ref={inputRef} onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} accept={acceptedTypes} className="hidden" disabled={disabled} />
      {children}
    </div>
  );
};

const ToolWrapper = ({ title, onBack, children }: { title: string, onBack: () => void, children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
    <Button variant="outline" onClick={onBack} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Back to Tools</Button>
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </motion.div>
);

const AgreementSummaryTool = ({ onBack }: { onBack: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    setLoading(true);
    setSummary("");
    try {
      const text = await readFileAsText(file);
      const { data, error } = await supabase.functions.invoke('document-summarizer', {
        body: { text },
      });
      if (error) throw error;
      setSummary(data.summary);
      toast({ title: "Summary Generated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper title="Agreement Summary" onBack={onBack}>
      <div className="space-y-4">
        <FileUploader onFileSelect={setFile} acceptedTypes=".txt">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="font-semibold">{file ? file.name : "Click or drag file to upload"}</p>
          <p className="text-sm text-muted-foreground">.txt files only</p>
        </FileUploader>
        <Button onClick={handleSummarize} disabled={!file || loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Summarize Document
        </Button>
        {summary && <Card className="p-4 prose dark:prose-invert max-w-full"><ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown></Card>}
      </div>
    </ToolWrapper>
  );
};

const CompareAgreementsTool = ({ onBack }: { onBack: () => void }) => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [comparison, setComparison] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCompare = async () => {
    if (!file1 || !file2) {
      toast({ title: "Please select two files", variant: "destructive" });
      return;
    }
    setLoading(true);
    setComparison("");
    try {
      const text1 = await readFileAsText(file1);
      const text2 = await readFileAsText(file2);
      const { data, error } = await supabase.functions.invoke('document-comparer', {
        body: { text1, text2 },
      });
      if (error) throw error;
      setComparison(data.comparison);
      toast({ title: "Comparison Complete!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper title="Compare Agreements" onBack={onBack}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FileUploader onFileSelect={setFile1} acceptedTypes=".txt">
            <p className="font-semibold">{file1 ? file1.name : "Upload Document 1"}</p>
            <p className="text-xs text-muted-foreground">.txt only</p>
          </FileUploader>
          <FileUploader onFileSelect={setFile2} acceptedTypes=".txt">
            <p className="font-semibold">{file2 ? file2.name : "Upload Document 2"}</p>
            <p className="text-xs text-muted-foreground">.txt only</p>
          </FileUploader>
        </div>
        <Button onClick={handleCompare} disabled={!file1 || !file2 || loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Compare Documents
        </Button>
        {comparison && <Card className="p-4 prose dark:prose-invert max-w-full"><ReactMarkdown remarkPlugins={[remarkGfm]}>{comparison}</ReactMarkdown></Card>}
      </div>
    </ToolWrapper>
  );
};

const DocumentTranslationTool = ({ onBack }: { onBack: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("Hindi");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTranslation("");
    try {
      const text = await readFileAsText(file);
      const { data, error } = await supabase.functions.invoke('document-translator', {
        body: { text, language },
      });
      if (error) throw error;
      setTranslation(data.translation);
      toast({ title: "Translation Complete!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper title="Document Translation" onBack={onBack}>
      <div className="space-y-4">
        <FileUploader onFileSelect={setFile} acceptedTypes=".txt">
          <p className="font-semibold">{file ? file.name : "Upload Document"}</p>
          <p className="text-sm text-muted-foreground">.txt files only</p>
        </FileUploader>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Hindi">Hindi</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Chinese">Chinese</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleTranslate} disabled={!file || loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Translate
        </Button>
        {translation && <Card className="p-4 prose dark:prose-invert max-w-full"><ReactMarkdown remarkPlugins={[remarkGfm]}>{translation}</ReactMarkdown></Card>}
      </div>
    </ToolWrapper>
  );
};

const ImageToTextTool = ({ onBack }: { onBack: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExtract = async () => {
    if (!file) {
      toast({ title: "No image selected", variant: "destructive" });
      return;
    }
    setLoading(true);
    setText("");
    try {
      const { data: base64, mimeType } = await readFileAsBase64(file);
      const { data, error } = await supabase.functions.invoke('image-ocr', {
        body: { image: base64, mimeType },
      });
      if (error) throw error;
      setText(data.text);
      toast({ title: "Text Extracted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper title="Image to Text (OCR)" onBack={onBack}>
      <div className="space-y-4">
        <FileUploader onFileSelect={setFile} acceptedTypes="image/*">
          <p className="font-semibold">{file ? file.name : "Upload Image"}</p>
        </FileUploader>
        <Button onClick={handleExtract} disabled={!file || loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Extract Text
        </Button>
        {text && <Card className="p-4 prose dark:prose-invert max-w-full"><ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown></Card>}
      </div>
    </ToolWrapper>
  );
};

const CreateAgreementTool = ({ onBack }: { onBack: () => void }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleDownload = (format: 'pdf' | 'word') => {
    if (!selectedTemplate) return;

    for (const field of selectedTemplate.fields) {
      if (field.required && !formData[field.id]) {
        toast({
          title: "Missing Information",
          description: `Please fill out the "${field.label}" field.`,
          variant: "destructive",
        });
        return;
      }
    }

    const htmlContent = selectedTemplate.generateContent(formData);
    const filename = selectedTemplate.title;

    try {
      if (format === 'pdf') {
        downloadAsPdf(htmlContent, filename);
        toast({ title: "Downloading PDF...", description: `Your document "${filename}" is being prepared.` });
      } else {
        downloadAsWord(htmlContent, filename);
        toast({ title: "Downloading Word Document...", description: `Your document "${filename}" is being prepared.` });
      }
    } catch (error: any) {
      toast({ title: "Download Error", description: error.message, variant: "destructive" });
    }
  };

  if (selectedTemplate) {
    return (
      <ToolWrapper title={`Create: ${selectedTemplate.title}`} onBack={() => {
        setSelectedTemplate(null);
        setFormData({});
      }}>
        <CardDescription>{selectedTemplate.description}</CardDescription>
        <div className="space-y-4 mt-6">
          {selectedTemplate.fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="mt-1"
                />
              ) : field.type === 'select' ? (
                <Select
                  value={formData[field.id] || ''}
                  onValueChange={(value) => handleFieldChange(field.id, value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          ))}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={() => handleDownload('pdf')} className="flex-1">
              <Download className="h-4 w-4 mr-2" /> Download as PDF
            </Button>
            <Button onClick={() => handleDownload('word')} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" /> Download as Word
            </Button>
          </div>
        </div>
      </ToolWrapper>
    );
  }

  return (
    <ToolWrapper title="Create an Agreement" onBack={onBack}>
      <CardDescription>Select a template to start creating your legal document.</CardDescription>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {templates.map(template => (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-300" onClick={() => setSelectedTemplate(template)}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <template.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{template.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ToolWrapper>
  );
};

export const DocumentTools = ({ category }: { category?: string }) => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  const tools = [
    { id: 'summary', title: 'Agreement Summary', icon: FileCheck, description: 'Get a concise summary of your document.' },
    { id: 'compare', title: 'Compare Agreements', icon: GitCompareArrows, description: 'Find differences between two documents.', pro: true },
    { id: 'create', title: 'Create an Agreement', icon: FilePlus, description: 'Generate documents from templates.' },
    { id: 'translate', title: 'Document Translation', icon: Languages, description: 'Translate documents to other languages.' },
    { id: 'ocr', title: 'Image to Text', icon: FileImage, description: 'Extract text from images.' },
  ];

  const renderToolContent = () => {
    switch (activeTool) {
      case 'summary': return <AgreementSummaryTool onBack={() => setActiveTool(null)} />;
      case 'compare': return <CompareAgreementsTool onBack={() => setActiveTool(null)} />;
      case 'create': return <CreateAgreementTool onBack={() => setActiveTool(null)} />;
      case 'translate': return <DocumentTranslationTool onBack={() => setActiveTool(null)} />;
      case 'ocr': return <ImageToTextTool onBack={() => setActiveTool(null)} />;
      default: return null;
    }
  };

  const renderToolSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Document Tools</h2>
        <p className="text-muted-foreground">Your all-in-one solution for document analysis and creation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map(tool => (
          <ToolButton
            key={tool.id}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            pro={tool.pro}
            onClick={() => setActiveTool(tool.id as Tool)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {activeTool ? renderToolContent() : renderToolSelection()}
    </div>
  );
};