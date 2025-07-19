import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, GitCompareArrows, FilePlus, Languages, FileImage, ArrowLeft, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type Tool = 'summary' | 'compare' | 'create' | 'translate' | 'ocr';

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

  const handleSummarize = () => {
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    setLoading(true);
    setSummary("");
    setTimeout(() => {
      setSummary("This is a placeholder summary of your document. Key points include the parties involved, the main obligations, and the term of the agreement. The AI has identified several important clauses regarding confidentiality and liability.");
      setLoading(false);
      toast({ title: "Summary Generated!" });
    }, 2000);
  };

  return (
    <ToolWrapper title="Agreement Summary" onBack={onBack}>
      <div className="space-y-4">
        <FileUploader onFileSelect={setFile} acceptedTypes=".pdf,.doc,.docx,.txt">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="font-semibold">{file ? file.name : "Click or drag file to upload"}</p>
          <p className="text-sm text-muted-foreground">PDF, DOC, DOCX, TXT</p>
        </FileUploader>
        <Button onClick={handleSummarize} disabled={!file || loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Summarize Document
        </Button>
        {summary && <Textarea value={summary} readOnly rows={10} placeholder="Summary will appear here..." />}
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

  const handleCompare = () => {
    if (!file1 || !file2) {
      toast({ title: "Please select two files", variant: "destructive" });
      return;
    }
    setLoading(true);
    setComparison("");
    setTimeout(() => {
      setComparison("Placeholder comparison result:\n- Clause 3.1 (Payment Terms): Differs in payment schedule.\n- Clause 5 (Term): Document 1 has a 2-year term, Document 2 has a 3-year term.\n- Added Clause 8.4 (Data Privacy) in Document 2.");
      setLoading(false);
      toast({ title: "Comparison Complete!" });
    }, 2000);
  };

  return (
    <ToolWrapper title="Compare Agreements" onBack={onBack}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FileUploader onFileSelect={setFile1} acceptedTypes=".pdf,.doc,.docx,.txt">
            <p className="font-semibold">{file1 ? file1.name : "Upload Document 1"}</p>
          </FileUploader>
          <FileUploader onFileSelect={setFile2} acceptedTypes=".pdf,.doc,.docx,.txt">
            <p className="font-semibold">{file2 ? file2.name : "Upload Document 2"}</p>
          </FileUploader>
        </div>
        <Button onClick={handleCompare} disabled={!file1 || !file2 || loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Compare Documents
        </Button>
        {comparison && <Textarea value={comparison} readOnly rows={10} placeholder="Comparison will appear here..." />}
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

  const handleTranslate = () => {
    if (!file) {
      toast({ title: "No file selected", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTranslation("");
    setTimeout(() => {
      setTranslation("यह आपके दस्तावेज़ का एक प्लेसहोल्डर अनुवाद है। (This is a placeholder translation of your document.)");
      setLoading(false);
      toast({ title: "Translation Complete!" });
    }, 2000);
  };

  return (
    <ToolWrapper title="Document Translation" onBack={onBack}>
      <div className="space-y-4">
        <FileUploader onFileSelect={setFile} acceptedTypes=".pdf,.doc,.docx,.txt">
          <p className="font-semibold">{file ? file.name : "Upload Document"}</p>
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
        {translation && <Textarea value={translation} readOnly rows={10} placeholder="Translation will appear here..." />}
      </div>
    </ToolWrapper>
  );
};

const ImageToTextTool = ({ onBack }: { onBack: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExtract = () => {
    if (!file) {
      toast({ title: "No image selected", variant: "destructive" });
      return;
    }
    setLoading(true);
    setText("");
    setTimeout(() => {
      setText("This is placeholder text extracted from your image. The OCR process has identified key headings and paragraphs.");
      setLoading(false);
      toast({ title: "Text Extracted!" });
    }, 2000);
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
        {text && <Textarea value={text} readOnly rows={10} placeholder="Extracted text will appear here..." />}
      </div>
    </ToolWrapper>
  );
};

const CreateAgreementTool = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();

  const handleGenerate = () => {
    toast({ title: "Coming Soon!", description: "Document creation from templates is available in the 'Legal Forms' tab." });
  };

  return (
    <ToolWrapper title="Create an Agreement" onBack={onBack}>
      <div className="text-center p-8">
        <p className="text-muted-foreground mb-4">This tool helps you generate agreements. For a full list of templates, please visit the "Legal Forms" section.</p>
        <Button onClick={handleGenerate}>Go to Legal Forms</Button>
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