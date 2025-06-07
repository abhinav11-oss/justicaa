import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  fields: DocumentField[];
  category: string;
}

interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface DocumentGeneratorProps {
  category?: string;
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: "rent-agreement",
    name: "Rent Agreement",
    type: "property",
    category: "personal",
    description: "Standard rental agreement template",
    fields: [
      { id: "landlord_name", label: "Landlord Name", type: "text", required: true, placeholder: "Enter landlord's full name" },
      { id: "tenant_name", label: "Tenant Name", type: "text", required: true, placeholder: "Enter tenant's full name" },
      { id: "property_address", label: "Property Address", type: "textarea", required: true, placeholder: "Complete property address" },
      { id: "rent_amount", label: "Monthly Rent (₹)", type: "text", required: true, placeholder: "25000" },
      { id: "security_deposit", label: "Security Deposit (₹)", type: "text", required: true, placeholder: "50000" },
      { id: "lease_duration", label: "Lease Duration", type: "select", required: true, options: ["11 months", "1 year", "2 years", "3 years"] },
      { id: "start_date", label: "Lease Start Date", type: "date", required: true }
    ]
  },
  {
    id: "nda",
    name: "Non-Disclosure Agreement (NDA)",
    type: "business",
    category: "business",
    description: "Confidentiality agreement template",
    fields: [
      { id: "disclosing_party", label: "Disclosing Party Name", type: "text", required: true, placeholder: "Company/Individual disclosing information" },
      { id: "receiving_party", label: "Receiving Party Name", type: "text", required: true, placeholder: "Company/Individual receiving information" },
      { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "Business discussion, partnership evaluation, etc." },
      { id: "duration", label: "Confidentiality Duration", type: "select", required: true, options: ["1 year", "2 years", "3 years", "5 years", "Indefinite"] },
      { id: "effective_date", label: "Effective Date", type: "date", required: true }
    ]
  },
  {
    id: "employment-contract",
    name: "Employment Contract",
    type: "employment",
    category: "business",
    description: "Standard employment agreement",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", required: true, placeholder: "Employer company name" },
      { id: "employee_name", label: "Employee Name", type: "text", required: true, placeholder: "Employee's full name" },
      { id: "position", label: "Job Position", type: "text", required: true, placeholder: "Job title" },
      { id: "salary", label: "Annual Salary", type: "text", required: true, placeholder: "500000" },
      { id: "start_date", label: "Start Date", type: "date", required: true },
      { id: "probation_period", label: "Probation Period", type: "select", required: true, options: ["3 months", "6 months", "1 year"] }
    ]
  },
  {
    id: "service-agreement",
    name: "Service Agreement",
    type: "contract",
    category: "contract",
    description: "Professional service contract",
    fields: [
      { id: "service_provider", label: "Service Provider", type: "text", required: true, placeholder: "Provider name" },
      { id: "client_name", label: "Client Name", type: "text", required: true, placeholder: "Client name" },
      { id: "services", label: "Services Description", type: "textarea", required: true, placeholder: "Detailed description of services" },
      { id: "payment_amount", label: "Payment Amount", type: "text", required: true, placeholder: "Total amount or hourly rate" },
      { id: "payment_terms", label: "Payment Terms", type: "select", required: true, options: ["Net 30", "Net 15", "Upon completion", "50% upfront"] },
      { id: "start_date", label: "Start Date", type: "date", required: true }
    ]
  },
  {
    id: "power-of-attorney",
    name: "Power of Attorney",
    type: "legal",
    category: "process",
    description: "Legal authorization document",
    fields: [
      { id: "principal_name", label: "Principal Name", type: "text", required: true, placeholder: "Person granting power" },
      { id: "agent_name", label: "Agent Name", type: "text", required: true, placeholder: "Person receiving power" },
      { id: "powers", label: "Powers Granted", type: "textarea", required: true, placeholder: "Specific powers being granted" },
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
      { id: "expiration", label: "Expiration", type: "select", required: true, options: ["Upon revocation", "Specific date", "Upon death"] }
    ]
  }
];

export const DocumentGenerator = ({ category }: DocumentGeneratorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx'>('pdf');
  const { toast } = useToast();
  const { user } = useAuth();

  // Filter templates by category
  const filteredTemplates = category && category !== "all" 
    ? documentTemplates.filter(template => template.category === category)
    : documentTemplates;

  const handleTemplateSelect = (templateId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate documents",
        variant: "destructive"
      });
      return;
    }

    const template = documentTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData({});
      setGeneratedDocument("");
      setShowPreview(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const generateDocument = () => {
    if (!selectedTemplate) return;

    // Check required fields
    const missingFields = selectedTemplate.fields
      .filter(field => field.required && !formData[field.id])
      .map(field => field.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Generate document based on template
    let document = "";

    switch (selectedTemplate.id) {
      case "rent-agreement":
        document = generateRentAgreement();
        break;
      case "nda":
        document = generateNDA();
        break;
      case "employment-contract":
        document = generateEmploymentContract();
        break;
      case "service-agreement":
        document = generateServiceAgreement();
        break;
      case "power-of-attorney":
        document = generatePowerOfAttorney();
        break;
    }

    setGeneratedDocument(document);
    setShowPreview(true);

    toast({
      title: "Document Generated",
      description: `Your ${selectedTemplate.name} has been created successfully`
    });
  };

  const generateRentAgreement = () => {
    return `
RENTAL AGREEMENT

This Rental Agreement is made between ${formData.landlord_name} (Landlord) and ${formData.tenant_name} (Tenant) for the property located at:

${formData.property_address}

TERMS AND CONDITIONS:

1. RENT: The monthly rent is ₹${formData.rent_amount}, payable on or before the 5th of each month.

2. SECURITY DEPOSIT: A security deposit of ₹${formData.security_deposit} has been paid by the Tenant.

3. LEASE PERIOD: This agreement is for ${formData.lease_duration} starting from ${formData.start_date}.

4. MAINTENANCE: The Tenant shall maintain the property in good condition and is responsible for minor repairs.

5. UTILITIES: Electricity, water, and other utility charges shall be borne by the Tenant.

6. TERMINATION: Either party may terminate this agreement by giving 30 days written notice.

7. GOVERNING LAW: This agreement shall be governed by Indian law.

IN WITNESS WHEREOF, both parties have executed this agreement.

LANDLORD: _________________     TENANT: _________________
${formData.landlord_name}                ${formData.tenant_name}

Date: ${new Date().toLocaleDateString()}

WITNESSES:
1. _________________
2. _________________
    `;
  };

  const generateNDA = () => {
    return `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement is entered into between:

DISCLOSING PARTY: ${formData.disclosing_party}
RECEIVING PARTY: ${formData.receiving_party}

WHEREAS, the parties wish to explore ${formData.purpose};

NOW THEREFORE, the parties agree:

1. CONFIDENTIAL INFORMATION: Any information disclosed by the Disclosing Party shall be considered confidential.

2. OBLIGATIONS: The Receiving Party agrees to:
   - Keep all confidential information secret
   - Use information only for the stated purpose
   - Not disclose to third parties without written consent

3. DURATION: This agreement shall remain in effect for ${formData.duration} from ${formData.effective_date}.

4. RETURN OF INFORMATION: Upon termination, all confidential materials must be returned or destroyed.

5. REMEDIES: Breach of this agreement may result in irreparable harm, entitling the Disclosing Party to injunctive relief.

DISCLOSING PARTY: _________________     RECEIVING PARTY: _________________
${formData.disclosing_party}                    ${formData.receiving_party}

Date: ${new Date().toLocaleDateString()}
    `;
  };

  const generateEmploymentContract = () => {
    return `
EMPLOYMENT CONTRACT

This Employment Contract is between ${formData.company_name} (Company) and ${formData.employee_name} (Employee).

POSITION: ${formData.position}
ANNUAL SALARY: ₹${formData.salary}
START DATE: ${formData.start_date}
PROBATION PERIOD: ${formData.probation_period}

TERMS AND CONDITIONS:

1. The Employee agrees to perform duties assigned by the Company.
2. The Employee shall maintain confidentiality of company information.
3. The Employee is entitled to statutory benefits as per Indian labor laws.
4. Either party may terminate employment with 30 days notice after probation.

COMPANY: _________________     EMPLOYEE: _________________
${formData.company_name}              ${formData.employee_name}

Date: ${new Date().toLocaleDateString()}
    `;
  };

  const generateServiceAgreement = () => {
    return `
SERVICE AGREEMENT

This Service Agreement is between ${formData.service_provider} (Provider) and ${formData.client_name} (Client).

SERVICES: ${formData.services}
PAYMENT: ${formData.payment_amount}
PAYMENT TERMS: ${formData.payment_terms}
START DATE: ${formData.start_date}

TERMS:

1. Provider agrees to deliver services as described above.
2. Client agrees to pay as per the payment terms.
3. Either party may terminate with 15 days notice.

PROVIDER: _________________     CLIENT: _________________
${formData.service_provider}           ${formData.client_name}

Date: ${new Date().toLocaleDateString()}
    `;
  };

  const generatePowerOfAttorney = () => {
    return `
POWER OF ATTORNEY

I, ${formData.principal_name}, hereby appoint ${formData.agent_name} as my attorney-in-fact.

POWERS GRANTED: ${formData.powers}
EFFECTIVE DATE: ${formData.effective_date}
EXPIRATION: ${formData.expiration}

This Power of Attorney shall be effective immediately and shall remain in effect until ${formData.expiration}.

PRINCIPAL: _________________
${formData.principal_name}

Date: ${new Date().toLocaleDateString()}

Notarized by: _________________
    `;
  };

  const downloadDocument = async () => {
    if (!generatedDocument) return;

    try {
      if (outputFormat === 'pdf') {
        // For PDF generation, we'll use a simple approach
        // In a real app, you'd use libraries like jsPDF or html2pdf
        const element = document.createElement('a');
        const file = new Blob([generatedDocument], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${selectedTemplate?.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      } else {
        // For DOCX, we'll also use text format for now
        // In a real app, you'd use libraries like html-docx-js
        const element = document.createElement('a');
        const file = new Blob([generatedDocument], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${selectedTemplate?.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

      toast({
        title: "Document Downloaded",
        description: `Your ${selectedTemplate?.name} has been saved as ${outputFormat.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download document. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6 text-center">
          <h4 className="text-lg font-medium text-amber-900 mb-2">Authentication Required</h4>
          <p className="text-amber-700 mb-4">Please sign in to access the document generator.</p>
        </CardContent>
      </Card>
    );
  }

  if (showPreview && generatedDocument) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Document Preview</h3>
          <div className="flex items-center space-x-2">
            <Select value={outputFormat} onValueChange={(value: 'pdf' | 'docx') => setOutputFormat(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="docx">DOCX</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <Eye className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={downloadDocument}>
              <Download className="h-4 w-4 mr-2" />
              Download {outputFormat.toUpperCase()}
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <pre className="whitespace-pre-wrap text-sm font-mono bg-slate-50 p-4 rounded border max-h-96 overflow-y-auto">
              {generatedDocument}
            </pre>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a basic template. Please review the document carefully and 
              consider consulting a lawyer for complex matters or before signing important agreements.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Legal Document Generator
            {category && (
              <Badge variant="outline" className="ml-2 capitalize">
                {category} Documents
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Select Document Type</Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a document template" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-slate-500">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTemplate.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate.fields.map((field) => (
              <div key={field.id}>
                <Label htmlFor={field.id}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === 'text' && (
                  <Input
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  />
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    rows={3}
                  />
                )}
                {field.type === 'date' && (
                  <Input
                    id={field.id}
                    type="date"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  />
                )}
                {field.type === 'select' && field.options && (
                  <Select onValueChange={(value) => handleFieldChange(field.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex-1">
                <Label>Output Format</Label>
                <Select value={outputFormat} onValueChange={(value: 'pdf' | 'docx') => setOutputFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="docx">Word Document</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 flex items-end">
                <Button onClick={generateDocument} className="w-full">
                  Generate {outputFormat.toUpperCase()}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};