
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle, Circle, Building, FileText, Home, Heart } from "lucide-react";

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
}

export const LegalGuides = () => {
  const [selectedGuide, setSelectedGuide] = useState<LegalGuide | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const guides: LegalGuide[] = [
    {
      id: "business-formation",
      title: "Starting a Business",
      description: "Complete guide to forming your business entity",
      category: "Business Law",
      duration: "30-45 min",
      difficulty: "Intermediate",
      icon: Building,
      steps: [
        {
          id: 1,
          title: "Choose Business Structure",
          description: "Decide between LLC, Corporation, Partnership, or Sole Proprietorship",
          completed: false
        },
        {
          id: 2,
          title: "Check Name Availability",
          description: "Ensure your business name is available in your state",
          completed: false
        },
        {
          id: 3,
          title: "Register Business Name",
          description: "File necessary paperwork with state authorities",
          completed: false
        },
        {
          id: 4,
          title: "Get EIN from IRS",
          description: "Obtain Federal Tax ID number for your business",
          completed: false
        },
        {
          id: 5,
          title: "Open Business Bank Account",
          description: "Separate business and personal finances",
          completed: false
        },
        {
          id: 6,
          title: "Get Required Licenses",
          description: "Obtain necessary business licenses and permits",
          completed: false
        }
      ]
    },
    {
      id: "will-estate",
      title: "Creating a Will",
      description: "Essential guide to estate planning and will creation",
      category: "Estate Planning",
      duration: "20-30 min",
      difficulty: "Beginner",
      icon: Heart,
      steps: [
        {
          id: 1,
          title: "Inventory Your Assets",
          description: "List all property, accounts, and valuable possessions",
          completed: false
        },
        {
          id: 2,
          title: "Choose Beneficiaries",
          description: "Decide who will inherit your assets",
          completed: false
        },
        {
          id: 3,
          title: "Select an Executor",
          description: "Choose someone to carry out your will's instructions",
          completed: false
        },
        {
          id: 4,
          title: "Consider Guardianship",
          description: "Name guardians for minor children if applicable",
          completed: false
        },
        {
          id: 5,
          title: "Draft the Will",
          description: "Write or use a template to create your will",
          completed: false
        },
        {
          id: 6,
          title: "Sign and Witness",
          description: "Properly execute the will with required witnesses",
          completed: false
        }
      ]
    },
    {
      id: "contract-basics",
      title: "Contract Review Checklist",
      description: "How to review and understand legal contracts",
      category: "Contract Law",
      duration: "15-20 min",
      difficulty: "Beginner",
      icon: FileText,
      steps: [
        {
          id: 1,
          title: "Identify the Parties",
          description: "Verify all parties are correctly named and identified",
          completed: false
        },
        {
          id: 2,
          title: "Review Terms and Conditions",
          description: "Understand all obligations and requirements",
          completed: false
        },
        {
          id: 3,
          title: "Check Payment Terms",
          description: "Review payment amounts, schedules, and methods",
          completed: false
        },
        {
          id: 4,
          title: "Examine Termination Clauses",
          description: "Understand how and when the contract can end",
          completed: false
        },
        {
          id: 5,
          title: "Look for Dispute Resolution",
          description: "Check how conflicts will be resolved",
          completed: false
        },
        {
          id: 6,
          title: "Verify Signatures Required",
          description: "Ensure proper execution requirements are met",
          completed: false
        }
      ]
    },
    {
      id: "tenant-rights",
      title: "Understanding Tenant Rights",
      description: "Know your rights and responsibilities as a tenant",
      category: "Housing Law",
      duration: "25-35 min",
      difficulty: "Beginner",
      icon: Home,
      steps: [
        {
          id: 1,
          title: "Review Your Lease",
          description: "Understand all terms and conditions in your rental agreement",
          completed: false
        },
        {
          id: 2,
          title: "Know Habitability Standards",
          description: "Learn what constitutes livable conditions",
          completed: false
        },
        {
          id: 3,
          title: "Understand Privacy Rights",
          description: "Know when and how landlords can enter your unit",
          completed: false
        },
        {
          id: 4,
          title: "Security Deposit Rules",
          description: "Learn about deposit protection and return requirements",
          completed: false
        },
        {
          id: 5,
          title: "Repair and Maintenance",
          description: "Understand responsibilities for property maintenance",
          completed: false
        },
        {
          id: 6,
          title: "Eviction Protection",
          description: "Know the legal eviction process and your protections",
          completed: false
        }
      ]
    }
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
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedGuide(null)}
          >
            ← Back to Guides
          </Button>
          <Badge variant="secondary">{selectedGuide.category}</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <selectedGuide.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{selectedGuide.title}</CardTitle>
                <CardDescription className="text-base">
                  {selectedGuide.description}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600 mt-4">
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
                className={`cursor-pointer transition-all ${isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'}`}
                onClick={() => toggleStepCompletion(step.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-slate-900'}`}>
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className={`text-sm mt-1 ${isCompleted ? 'text-green-700' : 'text-slate-600'}`}>
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
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Legal Process Guides</h3>
        <p className="text-slate-600">Step-by-step guidance through common legal procedures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide) => {
          const progress = getProgress(guide);
          return (
            <Card key={guide.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <guide.icon className="h-6 w-6 text-blue-600" />
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
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{guide.duration}</span>
                    <span>{guide.difficulty}</span>
                  </div>
                  {progress > 0 && (
                    <div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-slate-500 mt-1">{Math.round(progress)}% completed</p>
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
