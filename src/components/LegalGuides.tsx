import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Circle, Building, FileText, Home, Heart, Gavel, Scale, Users, BookOpen, BarChartHorizontal } from "lucide-react";
import { Flowchart } from "./Flowchart";

interface GuideStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface LegalGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  icon: any;
  steps: GuideStep[];
  flowchart: string;
}

export const LegalGuides = () => {
  const [selectedGuide, setSelectedGuide] = useState<LegalGuide | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const guides: LegalGuide[] = [
    {
      id: "business-formation",
      title: "Starting a Business in India",
      description: "A complete guide to registering your business entity in India.",
      category: "Business Law",
      duration: "45-60 min",
      difficulty: "Intermediate",
      icon: Building,
      steps: [
        { id: 1, title: "Choose Business Structure", description: "Decide on the right structure: Private Limited Company (for investment), LLP (for partners), One Person Company (for solo founders), Partnership, or Sole Proprietorship (simplest).", completed: false },
        { id: 2, title: "Obtain DIN and DSC", description: "Apply for a Director Identification Number (DIN) for all directors and a Digital Signature Certificate (DSC) for signing electronic forms on the MCA portal.", completed: false },
        { id: 3, title: "Reserve Company Name", description: "Use the SPICe+ (Part A) form on the Ministry of Corporate Affairs (MCA) portal to check for and reserve your proposed company name.", completed: false },
        { id: 4, title: "Draft MoA and AoA", description: "Draft the Memorandum of Association (MoA), which defines your company's objectives, and the Articles of Association (AoA), which outlines its internal rules.", completed: false },
        { id: 5, title: "File for Incorporation", description: "File the SPICe+ (Part B) form along with the MoA and AoA. This single form handles incorporation, DIN allotment, and applications for PAN and TAN.", completed: false },
        { id: 6, title: "Open Corporate Bank Account", description: "Once incorporated, open a current account in the company's name and deposit the initial share capital as declared in the MoA.", completed: false }
      ],
      flowchart: `
        graph TD
            A[Start] --> B{Choose Structure};
            B --> C[Pvt Ltd / LLP];
            B --> D[Proprietorship];
            C --> E[Obtain DIN/DSC];
            E --> F[Reserve Name via SPICe+];
            F --> G[Draft MoA/AoA];
            G --> H[File for Incorporation];
            H --> I[Open Bank Account];
            I --> Z[End];
            D --> J[Register under Shops Act];
            J --> I;
      `
    },
    {
      id: "will-estate",
      title: "Creating a Will in India",
      description: "Essential guide to drafting and executing a legally valid will.",
      category: "Estate Planning",
      duration: "30-40 min",
      difficulty: "Beginner",
      icon: Heart,
      steps: [
        { id: 1, title: "List Your Assets & Liabilities", description: "Create a comprehensive list of all your assets (property, bank accounts, investments) and any outstanding liabilities to ensure a clear distribution.", completed: false },
        { id: 2, title: "Choose Beneficiaries & Executor", description: "Clearly identify who will inherit your assets (beneficiaries). Appoint a trustworthy person or institution as the Executor to carry out the will's instructions.", completed: false },
        { id: 3, title: "Draft the Will", description: "Write the will in clear, unambiguous language. While no specific form is required, it must clearly state your intentions for asset distribution. Mention full names and details.", completed: false },
        { id: 4, title: "Sign in Presence of Two Witnesses", description: "You (the testator) must sign the will in the presence of at least two witnesses, who must see you sign or acknowledge your signature.", completed: false },
        { id: 5, title: "Witnesses Must Attest", description: "The two witnesses must sign the will in your presence and in the presence of each other. Beneficiaries should not be witnesses to avoid conflicts of interest.", completed: false },
        { id: 6, title: "Register the Will (Optional)", description: "While not mandatory, registering your will at the Sub-Registrar's office adds a layer of authenticity and makes it harder to challenge in court.", completed: false }
      ],
      flowchart: `
        graph TD
            A[Start] --> B[List Assets & Liabilities];
            B --> C[Choose Beneficiaries & Executor];
            C --> D[Draft the Will];
            D --> E[Sign in Presence of 2 Witnesses];
            E --> F[Witnesses Attest the Will];
            F --> G{Register Will?};
            G -->|Yes| H[Register at Sub-Registrar Office];
            G -->|No| I[Store Safely];
            H --> I;
            I --> J[End];
      `
    },
    {
      id: "fir-filing",
      title: "How to File an FIR in India",
      description: "Step-by-step guide to lodging a First Information Report.",
      category: "Criminal Law",
      duration: "15-20 min",
      difficulty: "Beginner",
      icon: Gavel,
      steps: [
        { id: 1, title: "Identify Police Station Jurisdiction", description: "An FIR should be filed at the police station in the area where the offense was committed. In case of uncertainty, police are obligated to register a 'Zero FIR' and transfer it.", completed: false },
        { id: 2, title: "Prepare Your Complaint", description: "You can give information orally or in writing. If oral, the police officer must write it down. It's helpful to pre-write the details: date, time, place, incident description, and names.", completed: false },
        { id: 3, title: "Lodge the FIR", description: "Narrate the incident to the officer in charge. The information recorded is read over to you. Once you confirm it's correct, you must sign the FIR.", completed: false },
        { id: 4, title: "Receive a Free Copy of FIR", description: "It is your legal right under Section 154(2) of the CrPC to receive a copy of the FIR free of cost. This copy is crucial proof that the complaint has been registered.", completed: false },
        { id: 5, title: "If Police Refuse to File FIR", description: "You can send your complaint in writing by registered post to the Superintendent of Police (SP). If that fails, you can file a complaint before the concerned Magistrate under Section 156(3) of CrPC.", completed: false },
        { id: 6, title: "Understand Cognizable Offenses", description: "An FIR can only be filed for cognizable offenses, which are serious crimes where police can arrest without a warrant (e.g., theft, assault, murder). For non-cognizable offenses, a complaint is filed with the Magistrate.", completed: false }
      ],
      flowchart: `
        graph TD
            A[Cognizable Offense Occurs] --> B[Go to Police Station];
            B --> C{Give Info};
            C -->|Oral| D[Police Officer Writes it Down];
            C -->|Written| E[Submit Written Complaint];
            D --> F[Read Over & Verify];
            E --> F;
            F --> G[Sign the FIR];
            G --> H[Receive Free Copy of FIR];
            H --> I{Police Cooperate?};
            I -->|Yes| J[Investigation Begins];
            I -->|No| K[Send Complaint to SP];
            K --> L[File Complaint with Magistrate];
            L --> J;
            J --> M[End];
      `
    },
    // ... other guides ...
  ];

  const toggleStepCompletion = (stepId: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const getProgress = (guide: LegalGuide) => {
    const completed = guide.steps.filter(step => completedSteps.includes(step.id)).length;
    return (completed / guide.steps.length) * 100;
  };

  if (selectedGuide) {
    const progress = getProgress(selectedGuide);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => setSelectedGuide(null)}
          >
            ← Back to Guides
          </Button>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BarChartHorizontal className="h-4 w-4 mr-2" />
                  View Flowchart
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{selectedGuide.title} - Process Flowchart</DialogTitle>
                </DialogHeader>
                <div className="py-4 flex justify-center">
                  <Flowchart chartDefinition={selectedGuide.flowchart} />
                </div>
              </DialogContent>
            </Dialog>
            <Badge variant="secondary">{selectedGuide.category}</Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <selectedGuide.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{selectedGuide.title}</CardTitle>
                <CardDescription className="text-base">
                  {selectedGuide.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-4">
              <span>Duration: {selectedGuide.duration}</span>
              <span>Difficulty: {selectedGuide.difficulty}</span>
              <span>Progress: {Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {selectedGuide.steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            return (
              <Card 
                key={step.id} 
                className={`cursor-pointer transition-all ${isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'hover:shadow-md'}`}
                onClick={() => toggleStepCompletion(step.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isCompleted ? 'text-green-800 dark:text-green-200' : 'text-foreground'}`}>
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className={`text-sm mt-1 ${isCompleted ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Legal Process Guides</h3>
        <p className="text-muted-foreground">Step-by-step guidance through common legal procedures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => {
          const progress = getProgress(guide);
          return (
            <Card key={guide.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <guide.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {guide.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="mb-4">
                  {guide.description}
                </CardDescription>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{guide.duration}</span>
                    <span>{guide.difficulty}</span>
                  </div>
                  {progress > 0 && (
                    <div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{Math.round(progress)}% completed</p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => setSelectedGuide(guide)}
                  className="w-full"
                  variant={progress > 0 ? "default" : "outline"}
                >
                  {progress > 0 ? "Continue Guide" : "Start Guide"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};