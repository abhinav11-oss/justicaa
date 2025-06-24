import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle, Circle, Building, FileText, Home, Heart, Gavel, Scale, Users, BookOpen } from "lucide-react";

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
    },
    {
      id: "fir-filing",
      title: "How to File an FIR",
      description: "Step-by-step guide to lodging a First Information Report in India",
      category: "Criminal Law",
      duration: "15-20 min",
      difficulty: "Beginner",
      icon: Gavel,
      steps: [
        {
          id: 1,
          title: "Identify the Police Station",
          description: "Determine the police station with jurisdiction over the crime scene.",
          completed: false
        },
        {
          id: 2,
          title: "Prepare Your Complaint",
          description: "Write down all details: date, time, place, incident description, names of parties involved, and witnesses.",
          completed: false
        },
        {
          id: 3,
          title: "Visit the Police Station",
          description: "Go to the police station and meet the officer in charge or the Station House Officer (SHO).",
          completed: false
        },
        {
          id: 4,
          title: "Lodge the FIR",
          description: "Narrate the incident to the police officer. They will write it down or you can submit your written complaint.",
          completed: false
        },
        {
          id: 5,
          title: "Get a Copy of FIR",
          description: "Insist on getting a free copy of the registered FIR. It's your legal right under Section 154(2) CrPC.",
          completed: false
        },
        {
          id: 6,
          title: "Follow Up",
          description: "Keep track of the investigation progress. If police refuse to register FIR, you can approach higher authorities or a Magistrate.",
          completed: false
        }
      ]
    },
    {
      id: "consumer-complaint",
      title: "Consumer Complaint Process",
      description: "Guide to filing a complaint under the Consumer Protection Act, 2019",
      category: "Consumer Law",
      duration: "20-25 min",
      difficulty: "Intermediate",
      icon: Scale,
      steps: [
        {
          id: 1,
          title: "Send Legal Notice",
          description: "Before filing, send a legal notice to the service provider/seller detailing the issue and relief sought.",
          completed: false
        },
        {
          id: 2,
          title: "Identify Appropriate Forum",
          description: "Determine if your complaint falls under District, State, or National Consumer Commission based on claim value.",
          completed: false
        },
        {
          id: 3,
          title: "Draft the Complaint",
          description: "Prepare a detailed complaint including facts, evidence, and the relief you are seeking.",
          completed: false
        },
        {
          id: 4,
          title: "Attach Documents",
          description: "Include all relevant documents like bills, warranty cards, communication, and legal notice copy.",
          completed: false
        },
        {
          id: 5,
          title: "File the Complaint",
          description: "File the complaint online (e-Daakhil portal) or offline with the respective Consumer Commission along with the prescribed fee.",
          completed: false
        },
        {
          id: 6,
          title: "Attend Hearings",
          description: "Attend all scheduled hearings and present your case. The commission will then pass an order.",
          completed: false
        }
      ]
    },
    {
      id: "divorce-process",
      title: "Understanding Divorce in India",
      description: "A guide to the legal procedures for divorce in India",
      category: "Family Law",
      duration: "30-40 min",
      difficulty: "Advanced",
      icon: Users,
      steps: [
        {
          id: 1,
          title: "Grounds for Divorce",
          description: "Understand the legal grounds for divorce under Hindu Marriage Act, Special Marriage Act, etc. (e.g., cruelty, desertion, adultery).",
          completed: false
        },
        {
          id: 2,
          title: "Mutual Consent vs. Contested",
          description: "Decide if it's a mutual consent divorce (faster) or a contested divorce (longer, requires proving grounds).",
          completed: false
        },
        {
          id: 3,
          title: "File Petition",
          description: "File a divorce petition in the Family Court with jurisdiction. For mutual consent, both parties file jointly.",
          completed: false
        },
        {
          id: 4,
          title: "Mediation/Counseling",
          description: "Courts often mandate mediation or counseling sessions to explore reconciliation before proceeding.",
          completed: false
        },
        {
          id: 5,
          title: "Evidence and Hearings",
          description: "In contested cases, present evidence, cross-examine witnesses, and attend multiple hearings.",
          completed: false
        },
        {
          id: 6,
          title: "Final Decree",
          description: "Once satisfied, the court passes the divorce decree, legally dissolving the marriage.",
          completed: false
        }
      ]
    },
    {
      id: "rti-filing",
      title: "Filing an RTI Application",
      description: "A comprehensive guide to filing a Right to Information (RTI) application",
      category: "Public Rights",
      duration: "10-15 min",
      difficulty: "Beginner",
      icon: BookOpen,
      steps: [
        {
          id: 1,
          title: "Identify Public Authority",
          description: "Determine which public authority holds the information you need (Central or State).",
          completed: false
        },
        {
          id: 2,
          title: "Locate PIO/APIO",
          description: "Find the Public Information Officer (PIO) or Assistant Public Information Officer (APIO) for that authority.",
          completed: false
        },
        {
          id: 3,
          title: "Draft Your Application",
          description: "Write a clear and concise application in English, Hindi, or the official language of the area, specifying the information required.",
          completed: false
        },
        {
          id: 4,
          title: "Pay the Fee",
          description: "Pay the prescribed fee (usually ₹10 for Central Govt.) via IPO, DD, or cash. BPL cardholders are exempt.",
          completed: false
        },
        {
          id: 5,
          title: "Submit the Application",
          description: "Submit the application online (rtionline.gov.in) or offline via post/in person.",
          completed: false
        },
        {
          id: 6,
          title: "Await Response or Appeal",
          description: "The PIO must respond within 30 days (48 hours for life/liberty matters). If no response or unsatisfactory, file a First Appeal.",
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
                className={`cursor-pointer transition-all ${isCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'hover:shadow-md'}`}
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