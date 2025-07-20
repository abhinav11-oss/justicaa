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
      title: "Starting a Business in India",
      description: "A complete guide to registering your business entity in India.",
      category: "Business Law",
      duration: "45-60 min",
      difficulty: "Intermediate",
      icon: Building,
      steps: [
        {
          id: 1,
          title: "Choose Business Structure",
          description: "Decide on the right structure: Private Limited Company (for investment), LLP (for partners), One Person Company (for solo founders), Partnership, or Sole Proprietorship (simplest).",
          completed: false
        },
        {
          id: 2,
          title: "Obtain DIN and DSC",
          description: "Apply for a Director Identification Number (DIN) for all directors and a Digital Signature Certificate (DSC) for signing electronic forms on the MCA portal.",
          completed: false
        },
        {
          id: 3,
          title: "Reserve Company Name",
          description: "Use the SPICe+ (Part A) form on the Ministry of Corporate Affairs (MCA) portal to check for and reserve your proposed company name.",
          completed: false
        },
        {
          id: 4,
          title: "Draft MoA and AoA",
          description: "Draft the Memorandum of Association (MoA), which defines your company's objectives, and the Articles of Association (AoA), which outlines its internal rules.",
          completed: false
        },
        {
          id: 5,
          title: "File for Incorporation",
          description: "File the SPICe+ (Part B) form along with the MoA and AoA. This single form handles incorporation, DIN allotment, and applications for PAN and TAN.",
          completed: false
        },
        {
          id: 6,
          title: "Open Corporate Bank Account",
          description: "Once incorporated, open a current account in the company's name and deposit the initial share capital as declared in the MoA.",
          completed: false
        }
      ]
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
        {
          id: 1,
          title: "List Your Assets & Liabilities",
          description: "Create a comprehensive list of all your assets (property, bank accounts, investments) and any outstanding liabilities to ensure a clear distribution.",
          completed: false
        },
        {
          id: 2,
          title: "Choose Beneficiaries & Executor",
          description: "Clearly identify who will inherit your assets (beneficiaries). Appoint a trustworthy person or institution as the Executor to carry out the will's instructions.",
          completed: false
        },
        {
          id: 3,
          title: "Draft the Will",
          description: "Write the will in clear, unambiguous language. While no specific form is required, it must clearly state your intentions for asset distribution. Mention full names and details.",
          completed: false
        },
        {
          id: 4,
          title: "Sign in Presence of Two Witnesses",
          description: "You (the testator) must sign the will in the presence of at least two witnesses, who must see you sign or acknowledge your signature.",
          completed: false
        },
        {
          id: 5,
          title: "Witnesses Must Attest",
          description: "The two witnesses must sign the will in your presence and in the presence of each other. Beneficiaries should not be witnesses to avoid conflicts of interest.",
          completed: false
        },
        {
          id: 6,
          title: "Register the Will (Optional)",
          description: "While not mandatory, registering your will at the Sub-Registrar's office adds a layer of authenticity and makes it harder to challenge in court.",
          completed: false
        }
      ]
    },
    {
      id: "contract-basics",
      title: "Contract Review Checklist",
      description: "How to review and understand legal contracts before you sign.",
      category: "Contract Law",
      duration: "15-20 min",
      difficulty: "Beginner",
      icon: FileText,
      steps: [
        {
          id: 1,
          title: "Identify the Parties",
          description: "Ensure all parties involved are correctly and fully identified with their legal names and addresses. Ambiguity here can make the contract unenforceable.",
          completed: false
        },
        {
          id: 2,
          title: "Define Scope of Work/Obligations",
          description: "The contract must clearly state what each party is required to do, including deliverables, timelines, and quality standards. Vague terms can lead to disputes.",
          completed: false
        },
        {
          id: 3,
          title: "Check Payment Terms",
          description: "Verify the exact payment amount, currency, schedule (e.g., upfront, milestones), method of payment, and any penalties for late payments.",
          completed: false
        },
        {
          id: 4,
          title: "Examine Term and Termination",
          description: "Understand the contract's duration (term) and the specific conditions under which either party can legally terminate the agreement before its completion.",
          completed: false
        },
        {
          id: 5,
          title: "Review Confidentiality & IP",
          description: "Look for clauses on how confidential information should be handled and who owns any intellectual property (IP) created during the contract period.",
          completed: false
        },
        {
          id: 6,
          title: "Find the Dispute Resolution Clause",
          description: "Check how disagreements will be handled. This clause specifies the governing law, jurisdiction (which city's courts), and method (e.g., arbitration, mediation, litigation).",
          completed: false
        }
      ]
    },
    {
      id: "tenant-rights",
      title: "Understanding Tenant Rights in India",
      description: "Know your rights and responsibilities as a tenant under Indian law.",
      category: "Housing Law",
      duration: "25-35 min",
      difficulty: "Beginner",
      icon: Home,
      steps: [
        {
          id: 1,
          title: "Insist on a Written Agreement",
          description: "Always have a written rental agreement. If the tenancy is for more than 11 months, the agreement must be registered with the Sub-Registrar's office to be legally valid.",
          completed: false
        },
        {
          id: 2,
          title: "Right to Fair Rent",
          description: "Landlords cannot charge an exorbitant amount of rent. The rent should be as per the agreement, and any increase must be as per the terms mentioned or state laws.",
          completed: false
        },
        {
          id: 3,
          title: "Protection from Unfair Eviction",
          description: "A landlord cannot evict you without a valid reason (e.g., non-payment of rent, property damage) and must serve a proper legal notice as required by state-specific rent control acts.",
          completed: false
        },
        {
          id: 4,
          title: "Right to Essential Services",
          description: "The landlord cannot cut off or withhold essential services like water, electricity, or sanitation as a way to recover rent dues or force you to vacate.",
          completed: false
        },
        {
          id: 5,
          title: "Security Deposit Rules",
          description: "The security deposit is typically limited to 2-3 months' rent. The landlord is obligated to return this amount after deducting for any damages upon vacation of the property.",
          completed: false
        },
        {
          id: 6,
          title: "Right to Privacy",
          description: "The landlord cannot enter your rented premises without prior notice, except in cases of emergency. The notice period is usually specified in the rental agreement.",
          completed: false
        }
      ]
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
        {
          id: 1,
          title: "Identify Police Station Jurisdiction",
          description: "An FIR should be filed at the police station in the area where the offense was committed. In case of uncertainty, police are obligated to register a 'Zero FIR' and transfer it.",
          completed: false
        },
        {
          id: 2,
          title: "Prepare Your Complaint",
          description: "You can give information orally or in writing. If oral, the police officer must write it down. It's helpful to pre-write the details: date, time, place, incident description, and names.",
          completed: false
        },
        {
          id: 3,
          title: "Lodge the FIR",
          description: "Narrate the incident to the officer in charge. The information recorded is read over to you. Once you confirm it's correct, you must sign the FIR.",
          completed: false
        },
        {
          id: 4,
          title: "Receive a Free Copy of FIR",
          description: "It is your legal right under Section 154(2) of the CrPC to receive a copy of the FIR free of cost. This copy is crucial proof that the complaint has been registered.",
          completed: false
        },
        {
          id: 5,
          title: "If Police Refuse to File FIR",
          description: "You can send your complaint in writing by registered post to the Superintendent of Police (SP). If that fails, you can file a complaint before the concerned Magistrate under Section 156(3) of CrPC.",
          completed: false
        },
        {
          id: 6,
          title: "Understand Cognizable Offenses",
          description: "An FIR can only be filed for cognizable offenses, which are serious crimes where police can arrest without a warrant (e.g., theft, assault, murder). For non-cognizable offenses, a complaint is filed with the Magistrate.",
          completed: false
        }
      ]
    },
    {
      id: "consumer-complaint",
      title: "Consumer Complaint Process in India",
      description: "Guide to filing a complaint under the Consumer Protection Act, 2019.",
      category: "Consumer Law",
      duration: "20-25 min",
      difficulty: "Intermediate",
      icon: Scale,
      steps: [
        {
          id: 1,
          title: "Send Legal Notice",
          description: "Before filing a formal complaint, send a detailed legal notice to the service provider or seller, stating the grievance and the relief sought. This often resolves the issue.",
          completed: false
        },
        {
          id: 2,
          title: "Identify Appropriate Forum",
          description: "File in the District Commission for claims up to ₹50 Lakhs, State Commission for claims between ₹50 Lakhs and ₹2 Crores, and National Commission for claims above ₹2 Crores.",
          completed: false
        },
        {
          id: 3,
          title: "Draft the Complaint",
          description: "Prepare a complaint detailing the facts, the defect or deficiency in service, and the relief you are seeking. It does not require a lawyer, but clarity is key.",
          completed: false
        },
        {
          id: 4,
          title: "Attach Supporting Documents",
          description: "Include copies of all relevant documents: bills, receipts, warranty cards, photos, and a copy of the legal notice sent.",
          completed: false
        },
        {
          id: 5,
          title: "File the Complaint",
          description: "File the complaint online via the e-Daakhil portal (edaakhil.nic.in) or offline at the respective commission. A nominal fee is required based on the claim value.",
          completed: false
        },
        {
          id: 6,
          title: "Attend Hearings",
          description: "Both parties will be notified of hearings. You can represent yourself or hire a lawyer. The commission will hear both sides and pass a final order.",
          completed: false
        }
      ]
    },
    {
      id: "divorce-process",
      title: "Understanding Divorce in India",
      description: "A guide to the legal procedures for divorce in India.",
      category: "Family Law",
      duration: "30-40 min",
      difficulty: "Advanced",
      icon: Users,
      steps: [
        {
          id: 1,
          title: "Mutual Consent vs. Contested Divorce",
          description: "Decide the type. Mutual consent (Sec 13B, Hindu Marriage Act) is faster, requiring both parties to agree. A contested divorce is filed by one spouse on grounds like cruelty, adultery, or desertion.",
          completed: false
        },
        {
          id: 2,
          title: "Filing the Divorce Petition",
          description: "The petition is filed in the Family Court with appropriate jurisdiction. For mutual consent, a joint petition is filed. For contested, one spouse files against the other.",
          completed: false
        },
        {
          id: 3,
          title: "Court Proceedings & Summons",
          description: "The court examines the petition and, if admitted, sends a summons to the other party. In contested cases, the other party files a reply.",
          completed: false
        },
        {
          id: 4,
          title: "Mediation/Counseling",
          description: "The court often refers the couple for mediation or counseling to explore possibilities of reconciliation. This step is mandatory in many jurisdictions.",
          completed: false
        },
        {
          id: 5,
          title: "Interim Orders & Evidence",
          description: "During the process, either party can file for temporary maintenance and child custody (interim orders). In contested cases, both sides present evidence and cross-examine witnesses.",
          completed: false
        },
        {
          id: 6,
          title: "Final Arguments & Decree",
          description: "After evidence, final arguments are made. If the court is satisfied, it passes the divorce decree, legally dissolving the marriage. For mutual consent, this happens after a 6-18 month cooling-off period.",
          completed: false
        }
      ]
    },
    {
      id: "rti-filing",
      title: "Filing an RTI Application",
      description: "A comprehensive guide to using the Right to Information Act.",
      category: "Public Rights",
      duration: "10-15 min",
      difficulty: "Beginner",
      icon: BookOpen,
      steps: [
        {
          id: 1,
          title: "Identify the Public Authority",
          description: "Determine which government department, ministry, or public sector undertaking holds the information you need. This could be Central, State, or local.",
          completed: false
        },
        {
          id: 2,
          title: "Draft Your Application",
          description: "Write a clear and specific application. Ask direct questions. You do not need to give a reason for seeking information. Include your name and contact address.",
          completed: false
        },
        {
          id: 3,
          title: "Address it to the PIO",
          description: "Address the application to the Public Information Officer (PIO) of the concerned department. If you don't know the PIO's name, just use the designation.",
          completed: false
        },
        {
          id: 4,
          title: "Pay the Fee",
          description: "Pay the prescribed fee (usually ₹10 for Central Govt.) via IPO, DD, or cash. BPL cardholders are exempt from paying the fee upon providing proof.",
          completed: false
        },
        {
          id: 5,
          title: "Submit and Get Acknowledgment",
          description: "Submit the application online (rtionline.gov.in for central departments) or offline via post/in person. Always get a dated acknowledgment.",
          completed: false
        },
        {
          id: 6,
          title: "Timeline and First Appeal",
          description: "The PIO must respond within 30 days. If you don't receive a response or are unsatisfied, you can file a First Appeal with the First Appellate Authority within 30 days of the PIO's response deadline.",
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