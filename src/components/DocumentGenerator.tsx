import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from 'jspdf';

interface DocumentGeneratorProps {
  category?: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string[];
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number';
  required: boolean;
  placeholder?: string;
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
  // NEW TEMPLATES BELOW

  // Power of Attorney
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
  // Will Template
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
  // Offer Letter Template
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
  // Resignation Letter Template
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

const categoryMap = {
  "Business Law": ["Business Law", "Contract Review"],
  "Personal Legal": ["Personal Legal"],
  "Contract Review": ["Contract Review", "Business Law", "Personal Legal"]
};

export const DocumentGenerator = ({ category }: DocumentGeneratorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryMap>("Business Law");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "docx">("pdf");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getFilteredTemplates = () => {
    const relevantCategories = categoryMap[selectedCategory] || [];
    return documentTemplates.filter(template => 
      template.category.some(cat => relevantCategories.includes(cat))
    );
  };

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
    const lineHeight = 6;
    let yPosition = 30;

    // Add logo/header
    pdf.setFontSize(20);
    pdf.setFont("times", "bold");
    pdf.text("Justicaa - Your AI Partner for Legal Help", pageWidth / 2, 20, { align: "center" });
    
    pdf.setFontSize(16);
    pdf.text(title, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 20;

    // Add content
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");
    
    const lines = pdf.splitTextToSize(content, pageWidth - 2 * margin);
    
    lines.forEach((line: string) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    // Save with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`Justicaa_${title.replace(/\s+/g, '_')}_${timestamp}.pdf`);
  };

  const generateWordContent = (content: string, title: string): string => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { 
            font-family: 'Times New Roman', serif; 
            font-size: 12pt; 
            line-height: 1.6; 
            margin: 1in; 
        }
        .header { 
            text-align: center; 
            font-size: 16pt; 
            font-weight: bold; 
            margin-bottom: 20pt; 
        }
        .title { 
            text-align: center; 
            font-size: 14pt; 
            font-weight: bold; 
            margin-bottom: 20pt; 
        }
        .content { 
            text-align: justify; 
            white-space: pre-line; 
        }
    </style>
</head>
<body>
    <div class="header">Justicaa - Your AI Partner for Legal Help</div>
    <div class="title">${title}</div>
    <div class="content">${content}</div>
</body>
</html>`;
  };

  const downloadWordDocument = (content: string, title: string) => {
    const htmlContent = generateWordContent(content, title);
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.href = url;
    link.download = `Justicaa_${title.replace(/\s+/g, '_')}_${timestamp}.doc`;
    link.click();
    
    URL.revokeObjectURL(url);
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
      let content = "";
      const today = new Date().toLocaleDateString('en-IN');

      switch (selectedTemplate.id) {
        case "rent-agreement":
          content = `RENTAL AGREEMENT

This Rental Agreement is made on ${formData.lease_start || today} between ${formData.landlord_name || '[Landlord Name]'} (Landlord) and ${formData.tenant_name || '[Tenant Name]'} (Tenant).

PROPERTY DETAILS:
The property located at:
${formData.property_address || '[Property Address]'}

TERMS AND CONDITIONS:
1. Monthly Rent: ₹${formData.monthly_rent || '[Amount]'}
2. Security Deposit: ₹${formData.security_deposit || '[Amount]'}
3. Lease Duration: ${formData.lease_duration || '[Duration]'} months
4. Lease Start Date: ${formData.lease_start || '[Date]'}

LANDLORD OBLIGATIONS:
- Provide peaceful possession of the property
- Maintain the property in habitable condition
- Provide necessary repairs (structural)

TENANT OBLIGATIONS:
- Pay rent on time every month
- Maintain the property in good condition
- Not sublet without written permission
- Use property only for residential purposes

TERMINATION:
Either party may terminate this agreement with 30 days written notice.

This agreement is governed by the laws of India.

Landlord Signature: _________________     Tenant Signature: _________________
Date: ${today}                           Date: ${today}`;
          break;

        case "nda":
          content = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on ${formData.effective_date || today} between ${formData.disclosing_party || '[Disclosing Party]'} ("Disclosing Party") and ${formData.receiving_party || '[Receiving Party]'} ("Receiving Party").

PURPOSE:
${formData.purpose || '[Purpose of disclosure]'}

CONFIDENTIAL INFORMATION:
The Receiving Party acknowledges that it may receive confidential and proprietary information from the Disclosing Party.

OBLIGATIONS:
1. The Receiving Party agrees to hold all confidential information in strict confidence
2. Not to disclose any confidential information to third parties
3. Use confidential information solely for the stated purpose
4. Return or destroy all confidential materials upon request

DURATION:
This agreement shall remain in effect for ${formData.duration_years || '[Duration]'} years from the effective date.

REMEDIES:
Breach of this agreement may result in irreparable harm, and the Disclosing Party shall be entitled to seek injunctive relief.

This agreement is governed by the laws of India.

Disclosing Party: _________________     Receiving Party: _________________
Date: ${today}                         Date: ${today}`;
          break;

        case "affidavit":
          content = `AFFIDAVIT

I, ${formData.deponent_name || '[Deponent Name]'}, son/daughter of _________, aged _____ years, residing at ${formData.deponent_address || '[Address]'}, do hereby solemnly affirm and declare as under:

1. That I am the deponent herein and I am competent to swear this affidavit.

2. That the facts stated herein are true and correct to the best of my knowledge and belief.

3. ${formData.statement_details || '[Statement details]'}

4. That I have not concealed any material facts and the information provided is complete and accurate.

5. That this affidavit is being made for [specify purpose] and no other purpose.

I hereby declare that the contents of this affidavit are true to the best of my knowledge and belief and nothing material has been concealed therefrom.

DEPONENT

Verified at ${formData.place_of_oath || '[Place]'} on this ${formData.date_of_oath || today}.

The contents of the above affidavit are true to the best of my knowledge and belief.

                                        _________________
                                        ${formData.deponent_name || '[Deponent Name]'}
                                        DEPONENT`;
          break;

        case "complaint-letter":
          content = `CONSUMER COMPLAINT

To,
The Consumer Disputes Redressal Commission
[Address]

Subject: Consumer Complaint against ${formData.respondent_name || '[Respondent Name]'}

Respected Sir/Madam,

I, ${formData.complainant_name || '[Complainant Name]'}, residing at ${formData.complainant_address || '[Address]'}, would like to file the following complaint:

RESPONDENT DETAILS:
${formData.respondent_name || '[Respondent Name]'}
${formData.respondent_address || '[Respondent Address]'}

COMPLAINT DETAILS:
${formData.complaint_details || '[Complaint details]'}

RELIEF SOUGHT:
${formData.relief_sought || '[Relief sought]'}

SUPPORTING DOCUMENTS:
[List any supporting documents attached]

I request you to kindly take necessary action against the respondent and provide appropriate relief.

Thanking you,

Yours faithfully,

${formData.complainant_name || '[Complainant Name]'}
Date: ${formData.complaint_date || today}
Signature: _________________`;
          break;

        case "employment-contract":
          content = `EMPLOYMENT AGREEMENT

This Employment Agreement is entered into on ${formData.start_date || today} between ${formData.employer_name || '[Employer Name]'} ("Company") and ${formData.employee_name || '[Employee Name]'} ("Employee").

POSITION AND DUTIES:
The Employee is hired for the position of ${formData.job_title || '[Job Title]'} and will perform duties as assigned by the Company.

COMPENSATION:
Monthly Salary: ₹${formData.salary || '[Amount]'}
Payment will be made monthly on or before the last working day of each month.

EMPLOYMENT TERMS:
1. Start Date: ${formData.start_date || '[Date]'}
2. Work Location: ${formData.work_location || '[Location]'}
3. Probation Period: ${formData.probation_period || '[Duration]'} months
4. Working Hours: As per company policy

EMPLOYEE OBLIGATIONS:
1. Maintain confidentiality of company information
2. Perform duties diligently and professionally
3. Comply with company policies and procedures
4. Provide adequate notice before resignation

TERMINATION:
Either party may terminate this agreement with appropriate notice as per labor laws.

This agreement is governed by the laws of India.

Company Representative: _____________    Employee: _________________
Date: ${today}                         Date: ${today}`;
          break;

        case "partnership-deed":
          content = `PARTNERSHIP DEED

This Partnership Deed is executed on ${today} between ${formData.partner1_name || '[Partner 1]'} and ${formData.partner2_name || '[Partner 2]'} (collectively "Partners").

BUSINESS DETAILS:
Business Name: ${formData.business_name || '[Business Name]'}
Business Address: ${formData.business_address || '[Business Address]'}

CAPITAL CONTRIBUTION:
${formData.partner1_name || '[Partner 1]'}: ₹${formData.partner1_investment || '[Amount]'}
${formData.partner2_name || '[Partner 2]'}: ₹${formData.partner2_investment || '[Amount]'}

PROFIT AND LOSS SHARING:
Profits and losses shall be shared in the ratio of ${formData.profit_sharing || '[Ratio]'}.

MANAGEMENT:
Both partners shall have equal rights in the management of the business unless otherwise agreed.

DUTIES AND RESPONSIBILITIES:
1. Each partner shall devote time and attention to the business
2. Major decisions require consent of both partners
3. Neither partner can bind the firm beyond ₹[Amount] without consent

DISSOLUTION:
The partnership may be dissolved by mutual consent or as per the Partnership Act, 1932.

This deed is governed by the laws of India.

Partner 1: _________________        Partner 2: _________________
Date: ${today}                     Date: ${today}`;
          break;

        case "power-attorney":
          content = `POWER OF ATTORNEY

This Power of Attorney is executed on ${formData.effective_date || today} at ${formData.place || '[Place]'}.

I, ${formData.principal_name || '[Principal Name]'}, hereby appoint ${formData.attorney_name || '[Attorney-in-fact Name]'} as my true and lawful attorney to perform, execute and do all acts and things in connection with:
${formData.powers_granted || '[List of Powers Granted]'}

IN WITNESS WHEREOF, I have executed this Power of Attorney on this date.

Principal: _________________
${formData.principal_name || '[Principal Name]'}
Attorney-in-fact: _________________
${formData.attorney_name || '[Attorney-in-fact Name]'}
Date: ${formData.effective_date || today}
Place: ${formData.place || '[Place]'}`;
          break;

        case "will":
          content = `LAST WILL & TESTAMENT

I, ${formData.testator_name || '[Testator Name]'}, residing at ${formData.testator_address || '[Address]'}, hereby declare this as my Last Will and Testament.

1. BENEFICIARIES:
${formData.beneficiaries || '[Names and Relationships]'}

2. EXECUTOR:
I appoint ${formData.executor || '[Executor Name]'} as executor of this will.

3. REVOCATION:
I revoke all previous wills and codicils made by me.

IN WITNESS WHEREOF, I have executed this last will at this date.

Testator: _________________
${formData.testator_name || '[Testator Name]'}    Date: ${formData.will_date || today}`;
          break;

        case "offer-letter":
          content = `OFFER LETTER

${formData.company_name || '[Company Name]'}
Date: ${today}

To,
${formData.candidate_name || '[Candidate Name]'}

Subject: Offer of Employment

Dear ${formData.candidate_name || '[Candidate Name]'},
We are pleased to offer you the position of ${formData.job_title || '[Job Title]'} with a monthly salary of ₹${formData.salary || '[Salary]'} at our ${formData.location || '[Work Location]'} office. Your joining date will be ${formData.joining_date || '[Date]'}.

Please confirm your acceptance of this offer.

Yours sincerely,
Authorized Signatory,
${formData.company_name || '[Company Name]'}`;
          break;

        case "resignation-letter":
          content = `RESIGNATION LETTER

To,
${formData.employer_name || '[Employer Name]'}

Subject: Resignation Letter

Dear Sir/Madam,

I, ${formData.employee_name || '[Employee Name]'}, am submitting my resignation with a notice period of ${formData.notice_period || '[Notice Period]'} days. My last working day will be ${formData.last_working_day || '[Date]'}.

${formData.reason ? `Reason: ${formData.reason}` : ""}

Thank you for the opportunities given to me.

Sincerely,
${formData.employee_name || '[Employee Name]'}
Date: ${today}`;
          break;

        default:
          content = "Document template not found.";
      }

      // Save to database first
      await saveDocumentToDatabase(selectedTemplate.name, content, selectedTemplate.id);

      // Then download
      if (selectedFormat === "pdf") {
        generatePDF(content, selectedTemplate.name);
      } else {
        downloadWordDocument(content, selectedTemplate.name);
      }

      toast({
        title: "Document Generated",
        description: `${selectedTemplate.name} has been downloaded as ${selectedFormat.toUpperCase()} and saved to your documents.`,
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
      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value as keyof typeof categoryMap)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Business Law">Business Law</TabsTrigger>
          <TabsTrigger value="Personal Legal">Personal Legal</TabsTrigger>
          <TabsTrigger value="Contract Review">Contract Review</TabsTrigger>
        </TabsList>

        {Object.keys(categoryMap).map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Document Generator</h3>
              <p className="text-slate-600">Generate professional legal documents for {cat.toLowerCase()}</p>
            </div>

            {/* Available Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Available Documents for {cat}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {getFilteredTemplates().map((template) => (
                    <Card 
                      key={template.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{template.name}</h4>
                            <p className="text-sm text-slate-600 mt-1">{template.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.category.map((cat) => (
                                <Badge key={cat} variant="outline" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Form */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle>Generate {selectedTemplate.name}</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="text-sm font-medium">Format:</label>
                      <Select value={selectedFormat} onValueChange={(value: "pdf" | "docx") => setSelectedFormat(value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="docx">Word</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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

                  <div className="flex space-x-4 pt-4">
                    <Button 
                      onClick={generateDocument}
                      disabled={isGenerating || !selectedFormat}
                      className="flex-1"
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
          </TabsContent>
        ))}
      </Tabs>

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>Legal Disclaimer:</strong> These templates are for informational purposes only and may not be suitable for all situations. 
              Please consult with a qualified attorney before using any legal documents. Customize the templates according to your specific needs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};