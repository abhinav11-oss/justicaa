import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';
import htmlDocx from 'html-docx-js';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number';
  required: boolean;
  placeholder?: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string[];
  fields: FormField[];
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: "rent-agreement",
    name: "Rent Agreement",
    description: "Standard rental agreement for residential property",
    category: ["Personal Legal", "Contract Review"],
    fields: [
      { id: "landlord_name", label: "Landlord Name", type: "text", required: true },
      { id: "tenant_name", label: "Tenant Name", type: "text", required: true },
      { id: "property_address", label: "Property Address", type: "textarea", required: true },
      { id: "monthly_rent", label: "Monthly Rent (₹)", type: "number", required: true },
      { id: "security_deposit", label: "Security Deposit (₹)", type: "number", required: true },
      { id: "lease_start", label: "Lease Start Date", type: "date", required: true },
      { id: "lease_duration", label: "Lease Duration (months)", type: "number", required: true }
    ]
  },
  {
    id: "nda",
    name: "Non-Disclosure Agreement (NDA)",
    description: "Confidentiality agreement for business purposes",
    category: ["Business Law", "Contract Review"],
    fields: [
      { id: "disclosing_party", label: "Disclosing Party", type: "text", required: true },
      { id: "receiving_party", label: "Receiving Party", type: "text", required: true },
      { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true },
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
      { id: "duration_years", label: "Duration (years)", type: "number", required: true }
    ]
  },
  {
    id: "affidavit",
    name: "General Affidavit",
    description: "Sworn statement for legal purposes",
    category: ["Personal Legal"],
    fields: [
      { id: "deponent_name", label: "Deponent Name", type: "text", required: true },
      { id: "deponent_address", label: "Deponent Address", type: "textarea", required: true },
      { id: "statement_details", label: "Statement Details", type: "textarea", required: true, placeholder: "Detailed statement to be sworn..." },
      { id: "place_of_oath", label: "Place of Oath", type: "text", required: true },
      { id: "date_of_oath", label: "Date of Oath", type: "date", required: true }
    ]
  },
  {
    id: "complaint-letter",
    name: "Consumer Complaint Letter",
    description: "Formal complaint letter for consumer issues",
    category: ["Personal Legal"],
    fields: [
      { id: "complainant_name", label: "Complainant Name", type: "text", required: true },
      { id: "complainant_address", label: "Complainant Address", type: "textarea", required: true },
      { id: "respondent_name", label: "Respondent/Company Name", type: "text", required: true },
      { id: "respondent_address", label: "Respondent Address", type: "textarea", required: true },
      { id: "complaint_details", label: "Complaint Details", type: "textarea", required: true },
      { id: "relief_sought", label: "Relief Sought", type: "textarea", required: true },
      { id: "complaint_date", label: "Date of Complaint", type: "date", required: true }
    ]
  },
  {
    id: "employment-contract",
    name: "Employment Contract",
    description: "Standard employment agreement template",
    category: ["Business Law", "Contract Review"],
    fields: [
      { id: "employer_name", label: "Employer Name", type: "text", required: true },
      { id: "employee_name", label: "Employee Name", type: "text", required: true },
      { id: "job_title", label: "Job Title", type: "text", required: true },
      { id: "salary", label: "Monthly Salary (₹)", type: "number", required: true },
      { id: "start_date", label: "Start Date", type: "date", required: true },
      { id: "probation_period", label: "Probation Period (months)", type: "number", required: true },
      { id: "work_location", label: "Work Location", type: "text", required: true }
    ]
  },
  {
    id: "partnership-deed",
    name: "Partnership Deed",
    description: "Agreement for business partnership",
    category: ["Business Law"],
    fields: [
      { id: "partner1_name", label: "Partner 1 Name", type: "text", required: true },
      { id: "partner2_name", label: "Partner 2 Name", type: "text", required: true },
      { id: "business_name", label: "Business Name", type: "text", required: true },
      { id: "business_address", label: "Business Address", type: "textarea", required: true },
      { id: "partner1_investment", label: "Partner 1 Investment (₹)", type: "number", required: true },
      { id: "partner2_investment", label: "Partner 2 Investment (₹)", type: "number", required: true },
      { id: "profit_sharing", label: "Profit Sharing Ratio", type: "text", required: true, placeholder: "e.g., 50:50" }
    ]
  },
  {
    id: "power-attorney",
    name: "Power of Attorney",
    description: "Grants authority to another individual to act on your behalf",
    category: ["Personal Legal"],
    fields: [
      { id: "principal_name", label: "Principal Name", type: "text", required: true },
      { id: "attorney_name", label: "Attorney-in-fact Name", type: "text", required: true },
      { id: "powers_granted", label: "Powers Granted", type: "textarea", required: true },
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
      { id: "place", label: "Place of Execution", type: "text", required: true }
    ]
  },
  {
    id: "will",
    name: "Last Will & Testament",
    description: "Template for declaring testamentary intent",
    category: ["Personal Legal"],
    fields: [
      { id: "testator_name", label: "Testator Name", type: "text", required: true },
      { id: "testator_address", label: "Testator Address", type: "textarea", required: true },
      { id: "beneficiaries", label: "Beneficiaries (name and relationship)", type: "textarea", required: true, placeholder: "List each" },
      { id: "executor", label: "Executor Name", type: "text", required: true },
      { id: "will_date", label: "Date", type: "date", required: true }
    ]
  },
  {
    id: "offer-letter",
    name: "Job Offer Letter",
    description: "Offer letter for new employee",
    category: ["Business Law"],
    fields: [
      { id: "company_name", label: "Company Name", type: "text", required: true },
      { id: "candidate_name", label: "Candidate Name", type: "text", required: true },
      { id: "job_title", label: "Job Title", type: "text", required: true },
      { id: "salary", label: "Monthly Salary (₹)", type: "number", required: true },
      { id: "joining_date", label: "Joining Date", type: "date", required: true },
      { id: "location", label: "Work Location", type: "text", required: true }
    ]
  },
  {
    id: "resignation-letter",
    name: "Resignation Letter",
    description: "Official resignation template",
    category: ["Business Law", "Personal Legal"],
    fields: [
      { id: "employee_name", label: "Employee Name", type: "text", required: true },
      { id: "employer_name", label: "Employer Name", type: "text", required: true },
      { id: "notice_period", label: "Notice Period (days)", type: "number", required: true },
      { id: "last_working_day", label: "Last Working Day", type: "date", required: true },
      { id: "reason", label: "Reason for Resignation", type: "textarea", required: false }
    ]
  }
];

export const CreateAgreementLight = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "docx">("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const validateForm = (): boolean => {
    if (!selectedTemplate) return false;
    
    const requiredFields = selectedTemplate.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.id]?.trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.map(f => f.label).join(", ")}`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const generatePDF = (content: string, title: string) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const lines = pdf.splitTextToSize(content, pageWidth - 2 * margin);
    pdf.text(lines, margin, margin);
    pdf.save(`Justicaa_${title.replace(/\s+/g, '_')}.pdf`);
  };

  const generateWordContent = (content: string, title: string): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
</head>
<body>
    <pre>${content}</pre>
</body>
</html>`;
  };

  const downloadWordDocument = (content: string, title: string) => {
    const htmlContent = generateWordContent(content, title);
    const blob = htmlDocx.asBlob(htmlContent);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Justicaa_${title.replace(/\s+/g, '_')}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveDocumentToDatabase = async (title: string, content: string, documentType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('legal_documents')
        .insert([
          {
            user_id: user.id,
            title: title,
            document_type: documentType,
            content: { text: content, formData: formData },
            status: 'completed'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Document Saved",
        description: "Document has been saved to your documents library."
      });
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save document to library.",
        variant: "destructive"
      });
    }
  };

  const generateDocument = async () => {
    if (!validateForm() || !selectedTemplate) return;

    setIsGenerating(true);

    try {
      let content = "Document content based on template and form data...";
      // This is a simplified placeholder. A real implementation would dynamically build the content.
      content = `${selectedTemplate.name.toUpperCase()}\n\n` + 
        selectedTemplate.fields.map(f => `${f.label}: ${formData[f.id] || ''}`).join('\n');

      await saveDocumentToDatabase(selectedTemplate.name, content, selectedTemplate.id);

      if (selectedFormat === "pdf") {
        generatePDF(content, selectedTemplate.name);
      } else {
        downloadWordDocument(content, selectedTemplate.name);
      }

      toast({
        title: "Document Generated",
        description: `${selectedTemplate.name} has been downloaded as ${selectedFormat.toUpperCase()} and saved.`,
      });

    } catch (error) {
      console.error('Error generating document:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Create from Template</h3>
        <p className="text-muted-foreground">Generate professional legal documents from pre-made templates.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Document Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {documentTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{template.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Generate {selectedTemplate.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {selectedTemplate.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="min-h-20"
                    />
                  ) : (
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <Select value={selectedFormat} onValueChange={(value: "pdf" | "docx") => setSelectedFormat(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">Word</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={generateDocument}
                disabled={isGenerating}
              >
                <Download className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : `Generate ${selectedFormat.toUpperCase()}`}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTemplate(null);
                  setFormData({});
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-200 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Legal Disclaimer:</strong> These templates are for informational purposes only. Please consult with a qualified attorney.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};