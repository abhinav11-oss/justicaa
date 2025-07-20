import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, Eye, Search, Building, Home, Users, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { templates, DocumentTemplate } from "@/data/document-templates";

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
                  <Badge variant="outline" className="mt-1">
                    {template.category}
                  </Badge>
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
                        <p className="text-sm text-foreground">This is a preview of the document structure.</p>
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
                              className="w-full p-2 rounded-md"
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
                      
                      <div className="pt-4">
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
      <Card className="bg-amber-50 dark:bg-amber-900/20">
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