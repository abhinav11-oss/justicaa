import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, FileText, MessageSquare, Scale, Users } from "lucide-react";

interface LegalServiceDetailProps {
  service: {
    id: string;
    title: string;
    description: string;
    icon: any;
  };
  onBack: () => void;
  onStartChat: () => void;
}

const serviceDetails = {
  "business": {
    faqs: [
      {
        question: "What's the difference between LLC and Corporation?",
        answer: "An LLC offers flexibility in management and tax treatment, while corporations have more formal structure. LLCs are generally easier to maintain and better for smaller businesses, while corporations are better for businesses seeking investment."
      },
      {
        question: "How do I register a business name?",
        answer: "First, check name availability with your state's business registration office. Then file the necessary paperwork (Articles of Incorporation for corporations, Articles of Organization for LLCs) with your state."
      },
      {
        question: "What licenses do I need for my business?",
        answer: "This depends on your business type and location. Common licenses include general business license, professional licenses, and industry-specific permits. Check with your local and state authorities."
      }
    ],
    guides: [
      "Choose your business structure (LLC, Corporation, Partnership)",
      "Check business name availability",
      "Register your business name",
      "Get Federal Tax ID (EIN)",
      "Open business bank account",
      "Obtain necessary licenses and permits"
    ],
    documents: [
      "Articles of Incorporation",
      "Operating Agreement",
      "Business License Application",
      "Employment Contracts",
      "Non-Disclosure Agreements"
    ]
  },
  "personal": {
    faqs: [
      {
        question: "Do I need a will?",
        answer: "Yes, everyone over 18 should have a will. It ensures your assets are distributed according to your wishes and can name guardians for minor children."
      },
      {
        question: "What's the difference between a will and a trust?",
        answer: "A will takes effect after death and goes through probate. A trust can take effect immediately and may avoid probate, offering more privacy and potentially faster distribution."
      },
      {
        question: "How often should I update my will?",
        answer: "Review your will every 3-5 years or after major life events like marriage, divorce, birth of children, or significant changes in assets."
      }
    ],
    guides: [
      "Inventory your assets and debts",
      "Choose beneficiaries for your assets",
      "Select an executor for your will",
      "Name guardians for minor children",
      "Draft your will or trust documents",
      "Sign and properly witness your documents"
    ],
    documents: [
      "Last Will and Testament",
      "Living Trust",
      "Power of Attorney",
      "Healthcare Directive",
      "Beneficiary Designations"
    ]
  },
  "contract": {
    faqs: [
      {
        question: "What makes a contract legally binding?",
        answer: "A contract needs: offer, acceptance, consideration (exchange of value), legal capacity of parties, and legal purpose. Written contracts are recommended for important agreements."
      },
      {
        question: "Can I cancel a contract after signing?",
        answer: "Generally no, but there are exceptions like cooling-off periods for certain purchases, fraud, duress, or if the contract violates laws."
      },
      {
        question: "What should I look for when reviewing a contract?",
        answer: "Check parties' names, terms and conditions, payment details, termination clauses, dispute resolution methods, and ensure all blanks are filled."
      }
    ],
    guides: [
      "Read the entire contract carefully",
      "Verify all parties are correctly identified",
      "Review payment terms and schedules",
      "Check termination and cancellation clauses",
      "Look for dispute resolution procedures",
      "Ensure proper signatures and dates"
    ],
    documents: [
      "Service Agreements",
      "Employment Contracts",
      "Rental Agreements",
      "Purchase Agreements",
      "Non-Compete Agreements"
    ]
  },
  "process": {
    faqs: [
      {
        question: "How long does it take to start a business?",
        answer: "Typically 1-4 weeks depending on your state and business type. Online filings are usually faster than paper submissions."
      },
      {
        question: "What's the probate process?",
        answer: "Probate validates a will, inventories assets, pays debts, and distributes remaining assets. It typically takes 6-12 months but can vary significantly."
      },
      {
        question: "How do I file a small claims case?",
        answer: "File at your local courthouse, pay filing fees, serve the defendant, and attend the hearing. Cases are usually resolved within 30-60 days."
      }
    ],
    guides: [
      "Identify the legal process you need",
      "Gather required documents and information",
      "File necessary paperwork with appropriate court/agency",
      "Pay required fees",
      "Follow up on deadlines and requirements",
      "Attend hearings or meetings as scheduled"
    ],
    documents: [
      "Court Filing Forms",
      "Petition Templates",
      "Motion Forms",
      "Affidavit Templates",
      "Notice Forms"
    ]
  }
};

export function LegalServiceDetail({ service, onBack, onStartChat }: LegalServiceDetailProps) {
  const details = serviceDetails[service.id as keyof typeof serviceDetails] || serviceDetails.business;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <service.icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{service.title}</h2>
            <p className="text-muted-foreground">{service.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about {service.title.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {details.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Get Help Now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={onStartChat} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with AI Assistant
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Find a Lawyer
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Generate Document
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {details.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded">
                    <span className="text-sm">{doc}</span>
                    <Badge variant="outline" className="text-xs">Template</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Step-by-step Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Guide</CardTitle>
          <CardDescription>Follow these steps for {service.title.toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {details.guides.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> This information is for general guidance only. 
            Laws vary by jurisdiction and individual circumstances may require modifications. 
            For specific legal advice, please consult with a qualified attorney.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}