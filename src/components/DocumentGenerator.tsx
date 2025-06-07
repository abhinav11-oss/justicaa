
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  fields: DocumentField[];
}

interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: "rent-agreement",
    name: "Rent Agreement",
    type: "property",
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
    id: "affidavit",
    name: "General Affidavit",
    type: "legal",
    description: "Sworn statement template",
    fields: [
      { id: "deponent_name", label: "Deponent Name", type: "text", required: true, placeholder: "Person making the affidavit" },
      { id: "deponent_address", label: "Deponent Address", type: "textarea", required: true, placeholder: "Complete address of deponent" },
      { id: "subject", label: "Subject/Title", type: "text", required: true, placeholder: "What the affidavit is about" },
      { id: "statement", label: "Statement/Declaration", type: "textarea", required: true, placeholder: "The facts being sworn to" },
      { id: "place", label: "Place of Execution", type: "text", required: true, placeholder: "City where affidavit is made" },
      { id: "date", label: "Date", type: "date", required: true }
    ]
  },
  {
    id: "complaint-letter",
    name: "Consumer Complaint Letter",
    type: "consumer",
    description: "Formal complaint letter template",
    fields: [
      { id: "complainant_name", label: "Your Name", type: "text", required: true, placeholder: "Your full name" },
      { id: "complainant_address", label: "Your Address", type: "textarea", required: true, placeholder: "Your complete address" },
      { id: "company_name", label: "Company/Service Provider", type: "text", required: true, placeholder: "Name of company you're complaining against" },
      { id: "company_address", label: "Company Address", type: "textarea", required: true, placeholder: "Company's address" },
      { id: "product_service", label: "Product/Service", type: "text", required: true, placeholder: "What you purchased or service received" },
      { id: "complaint_details", label: "Complaint Details", type: "textarea", required: true, placeholder: "Describe the issue in detail" },
      { id: "resolution_sought", label: "Resolution Sought", type: "textarea", required: true, placeholder: "What you want them to do" },
      { id: "date", label: "Date", type: "date", required: true }
    ]
  }
];

export const DocumentGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleTemplateSelect = (templateId: string) => {
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
      case "affidavit":
        document = generateAffidavit();
        break;
      case "complaint-letter":
        document = generateComplaintLetter();
        break;
    }

    setGeneratedDocument(document);
    setShowPreview(true);

    toast({
      title: "Document Generated",
      description: "Your legal document has been created successfully"
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

7. GOVERNING LAW: This agreement shall be governed by Indian law and courts in [City] shall have jurisdiction.

IN WITNESS WHEREOF, both parties have executed this agreement on the date mentioned below.

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

  const generateAffidavit = () => {
    return `
AFFIDAVIT

I, ${formData.deponent_name}, son/daughter of _______, aged __ years, resident of ${formData.deponent_address}, do hereby solemnly affirm and declare as under:

SUBJECT: ${formData.subject}

1. That I am the deponent herein and I have personal knowledge of the facts stated hereinafter.

2. That ${formData.statement}

3. That the above statement is true and correct to the best of my knowledge and belief and nothing has been concealed therein.

4. That I am making this affidavit for the purpose of _______ and for no other purpose.

DEPONENT

VERIFICATION:
Verified at ${formData.place} on ${formData.date} that the contents of the above affidavit are true and correct to the best of my knowledge and belief and nothing material has been concealed therefrom.

                                                    DEPONENT
                                               ${formData.deponent_name}
    `;
  };

  const generateComplaintLetter = () => {
    return `
CONSUMER COMPLAINT LETTER

To,
${formData.company_name}
${formData.company_address}

From,
${formData.complainant_name}
${formData.complainant_address}

Date: ${formData.date}

Subject: Complaint regarding ${formData.product_service}

Dear Sir/Madam,

I am writing to formally complain about the ${formData.product_service} I purchased/received from your company.

COMPLAINT DETAILS:
${formData.complaint_details}

This issue has caused me significant inconvenience and I believe your company should take immediate action to resolve this matter.

RESOLUTION SOUGHT:
${formData.resolution_sought}

I expect a prompt response and resolution within 15 days of receiving this complaint. If this matter is not resolved satisfactorily, I may be compelled to seek redressal through the appropriate consumer forum.

I trust you will take immediate action to resolve this issue.

Yours sincerely,

${formData.complainant_name}
    `;
  };

  const downloadDocument = () => {
    if (!generatedDocument) return;

    const blob = new Blob([generatedDocument], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Document Downloaded",
      description: "Your document has been saved successfully"
    });
  };

  if (showPreview && generatedDocument) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Document Preview</h3>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <Eye className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={downloadDocument}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <pre className="whitespace-pre-wrap text-sm font-mono bg-slate-50 p-4 rounded border">
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
                  {documentTemplates.map((template) => (
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
            
            <Button onClick={generateDocument} className="w-full mt-6">
              Generate Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
