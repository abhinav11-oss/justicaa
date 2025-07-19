import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, GitCompareArrows, FilePlus, Sparkles, Languages, ScanText, ArrowLeft } from "lucide-react";

// Import new components
import { AgreementSummary } from "./document-tools/AgreementSummary";
import { CompareAgreements } from "./document-tools/CompareAgreements";
import { CreateAgreementLight } from "./document-tools/CreateAgreementLight";
import { CreateAgreementPro } from "./document-tools/CreateAgreementPro";
import { DocumentTranslation } from "./document-tools/DocumentTranslation";
import { ImageToText } from "./document-tools/ImageToText";

const features = [
  { id: "summary", title: "Agreement Summary", icon: FileCheck, component: AgreementSummary },
  { id: "compare", title: "Compare Agreements", icon: GitCompareArrows, component: CompareAgreements },
  { id: "create-light", title: "Create from Template", icon: FilePlus, component: CreateAgreementLight },
  { id: "create-pro", title: "Create with AI", icon: Sparkles, component: CreateAgreementPro },
  { id: "translate", title: "Document Translation", icon: Languages, component: DocumentTranslation },
  { id: "image-to-text", title: "Image to Text (OCR)", icon: ScanText, component: ImageToText },
];

export const DocumentGenerator = ({ category }: { category?: string }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const selectedFeature = features.find(f => f.id === activeFeature);

  if (selectedFeature) {
    const FeatureComponent = selectedFeature.component;
    return (
      <div>
        <Button variant="outline" onClick={() => setActiveFeature(null)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Tools
        </Button>
        <FeatureComponent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Document Tools</h3>
        <p className="text-muted-foreground">Advanced tools to work with your legal documents.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.id} 
            className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
            onClick={() => setActiveFeature(feature.id)}
          >
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-lg">{feature.title}</h4>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};