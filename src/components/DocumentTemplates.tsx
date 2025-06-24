import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, Eye, Search, Building, Home, Users, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  icon: any;
  fields: TemplateField[];
  preview: string;
}

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export const DocumentTemplates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const categories = [
    { id: "all", name: "All Templates", icon: FileText },
    { id: "business", name: "Business", icon: Building },
    { id: "personal", name: "Personal", icon: Users },
    { id: "real-estate", name: "Real Estate", icon: Home },
    { id: "legal", name: "Legal Forms", icon: Scale }
  ];

  const templates: DocumentTemplate[] = [
    {
      id: "nda",
      title: "Non-Disclosure Agreement (NDA)",
      description: "Protect confidential information shared between parties",
      category: "business",
      difficulty: "Beginner",
      estimatedTime: "10-15 min",
      icon: FileText,
      fields: [
        { id: "disclosing_party", label: "Disclosing Party Name", type: "text", required: true, placeholder: "Company or Individual Name" },
        { id: "receiving_party", label: "Receiving Party Name", type: "text", required: true, placeholder: "Company or Individual Name" },
        { id: "purpose", label: "Purpose of Disclosure", type: "textarea", required: true, placeholder: "Describe the reason for sharing confidential information" },
        { id: "duration", label: "Agreement Duration", type: "select", required: true, options: ["1 Year", "2 Years", "3 Years", "5 Years", "Indefinite"] },
        { id: "governing_law", label: "Governing Law (State)", type: "text", required: true, placeholder: "e.g., California" }
      ],
      preview: "This Non-Disclosure Agreement creates a confidential relationship between {disclosing_party} and {receiving_party} for the purpose of {purpose}..."
    },
    {
      id: "service-agreement",
      title: "Service Agreement Contract",
      description: "Contract for professional services between client and provider",
      category: "business",
      difficulty: "Intermediate",
      estimatedTime: "20-25 min",
      icon: Building,
      fields: [
        { id: "service_provider", label: "Service Provider", type: "text", required: true, placeholder: "Your business name" },
        { id: "client_name", label: "Client Name", type: "text", required: true, placeholder: "Client's name or company" },
        { id: "services_description", label: "Services Description", type: "textarea", required: true, placeholder: "Detailed description of services to be provided" },
        { id: "payment_amount", label: "Payment Amount", type: "text", required: true, placeholder: "e.g., $5,000 or $100/hour" },
        { id: "payment_schedule", label: "Payment Schedule", type: "select", required: true, options: ["Upon completion", "Monthly", "Bi-weekly", "Weekly", "50% upfront, 50% completion"] },
        { id: "start_date", label: "Start Date", type: "date", required: true },
        { id: "completion_date", label: "Expected Completion", type: "date", required: true }
      ],
      preview: "This Service Agreement is between {service_provider} and {client_name} for the provision of {services_description}..."
    },
    {
      id: "rental-application",
      title: "Rental Application Form",
      description: "Standard application for prospective tenants",
      category: "real-estate",
      difficulty: "Beginner",
      estimatedTime: "15-20 min",
      icon: Home,
      fields: [
        { id: "applicant_name", label: "Full Name", type: "text", required: true, placeholder: "Applicant's full legal name" },
        { id: "current_address", label: "Current Address", type: "textarea", required: true, placeholder: "Current residence address" },
        { id: "monthly_income", label: "Monthly Income", type: "text", required: true, placeholder: "Gross monthly income" },
        { id: "employer", label: "Current Employer", type: "text", required: true, placeholder: "Company name" },
        { id: "employment_duration", label: "Employment Duration", type: "text", required: true, placeholder: "How long at current job" },
        { id: "references", label: "References", type: "textarea", required: true, placeholder: "Previous landlord or personal references" }
      ],
      preview: "Rental Application for {applicant_name} with monthly income of {monthly_income}..."
    },
    {
      id: "power-of-attorney",
      title: "Power of Attorney Form",
      description: "Authorize someone to act on your behalf for legal matters",
      category: "legal",
      difficulty: "Advanced",
      estimatedTime: "25-30 min",
      icon: Scale,
      fields: [
        { id: "principal_name", label: "Principal (Your Name)", type: "text", required: true, placeholder: "Person granting power" },
        { id: "agent_name", label: "Agent/Attorney-in-Fact", type: "text", required: true, placeholder: "Person receiving power" },
        { id: "powers_granted", label: "Powers Granted", type: "textarea", required: true, placeholder: "Specific powers being granted" },
        { id: "effective_date", label: "Effective Date", type: "date", required: true },
        { id: "expiration", label: "Expiration", type: "select", required: true, options: ["Upon revocation", "Specific date", "Upon incapacitation", "Upon death"] },
        { id: "notarization_location", label: "Notarization Location", type: "text", required: true, placeholder: "Where document will be notarized" }
      ],
      preview: "I, {principal_name}, hereby appoint {agent_name} as my attorney-in-fact to act on my behalf..."
    },
    {
      id: "employment-offer",
      title: "Employment Offer Letter",
      description: "Formal job offer with terms and conditions",
      category: "business",
      difficulty: "Intermediate",
      estimatedTime: "15-20 min",
      icon: Users,
      fields: [
        { id: "company_name", label: "Company Name", type: "text", required: true, placeholder: "Your company name" },
        { id: "candidate_name", label: "Candidate Name", type: "text", required: true, placeholder: "Job candidate's name" },
        { id: "position_title", label: "Position Title", type: "text", required: true, placeholder: "Job title" },
        { id: "salary", label: "Annual Salary", type: "text", required: true, placeholder: "e.g., $75,000" },
        { id: "start_date", label: "Start Date", type: "date", required: true },
        { id: "benefits", label: "Benefits Package", type: "textarea", required: true, placeholder: "Health insurance, PTO, etc." },
        { id: "reporting_manager", label: "Reporting Manager", type: "text", required: true, placeholder: "Direct supervisor's name" }
      ],
      preview: "Dear {candidate_name}, We are pleased to offer you the position of {position_title} at {company_name}..."
    },
    {
      id: "liability-waiver",
      title: "Liability Waiver Form",
      description: "Release form for activities with inherent risks",
      category: "personal",
      difficulty: "Intermediate",
      estimatedTime: "10-15 min",
      icon: Users,
      fields: [
        { id: "participant_name", label: "Participant Name", type: "text", required: true, placeholder: "Person participating in activity" },
        { id: "activity_description", label: "Activity Description", type: "textarea", required: true, placeholder: "Describe the activity or event" },
        { id: "organization_name", label: "Organization Name", type: "text", required: true, placeholder: "Company or organization hosting activity" },
        { id: "activity_date", label: "Activity Date", type: "date", required: true },
        { id: "emergency_contact", label: "Emergency Contact", type: "text", required: true, placeholder: "Name and phone number" }
      ],
      preview: "I, {participant_name}, voluntarily participate in {activity_description} organized by {organization_name}..."
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === "" || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const generateDocument = () => {
    // Simulate document generation
    toast({
      title: "Document Generated!",
      description: "Your legal document has been created and is ready for download.",
    });
  };

  const downloadTemplate = (template: DocumentTemplate) => {
    // Simulate template download
    toast({
      title: "Template Downloaded",
      description: `${template.title} template has been saved to your downloads.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Legal Document Templates</h3>
        <p className="text-muted-foreground">Ready-to-use legal forms and document templates</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search document templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2"
            >
              <category.icon className="h-4 w-4" />
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <template.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <div className="flex space-x-2 mt-1">
                    <Badge variant="outline">{template.category}</Badge>
                    <Badge variant="secondary">{template.difficulty}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <CardDescription className="mb-4">
                {template.description}
              </CardDescription>
              
              <div className="text-sm text-muted-foreground mb-4">
                <p>Estimated time: {template.estimatedTime}</p>
              </div>
              
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{template.title}</DialogTitle>
                      <DialogDescription>
                        {template.description}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Document Preview:</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-foreground">{template.preview}</p>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Required Information:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {template.fields.map((field) => (
                            <li key={field.id}>• {field.label}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create {template.title}</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to generate your legal document.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {template.fields.map((field) => (
                        <div key={field.id}>
                          <label className="block text-sm font-medium mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </label>
                          {field.type === 'textarea' ? (
                            <Textarea
                              placeholder={field.placeholder}
                              value={formData[field.id] || ''}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            />
                          ) : field.type === 'select' ? (
                            <select
                              className="w-full p-2 border border-input rounded-md"
                              value={formData[field.id] || ''}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            >
                              <option value="">Select an option</option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[field.id] || ''}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            />
                          )}
                        </div>
                      ))}
                      
                      <div className="pt-4 border-t">
                        <Button onClick={generateDocument} className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Generate Document
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legal Notice */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardContent className="py-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Important:</strong> These templates provide general forms and should be reviewed by a qualified attorney 
            before use. Laws vary by jurisdiction and individual circumstances may require modifications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};