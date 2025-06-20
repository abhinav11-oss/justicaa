
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronDown, ChevronRight, Scale, Building, Home, Heart, FileText, Users } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFAQs, setOpenFAQs] = useState<string[]>([]);

  const categories = [
    { id: "all", name: "All Topics", icon: Scale },
    { id: "business", name: "Business Law", icon: Building },
    { id: "housing", name: "Housing & Real Estate", icon: Home },
    { id: "family", name: "Family Law", icon: Heart },
    { id: "contracts", name: "Contracts", icon: FileText },
    { id: "employment", name: "Employment", icon: Users }
  ];

  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "What's the difference between LLC and Corporation?",
      answer: "An LLC (Limited Liability Company) offers flexibility in management and tax treatment, with profits/losses passing through to owners' personal tax returns. Corporations have more formal structure with boards and shareholders, and C-Corps face double taxation while S-Corps have pass-through taxation. LLCs are generally easier to maintain and better for smaller businesses, while corporations are better for businesses seeking investment or going public.",
      category: "business",
      tags: ["LLC", "corporation", "business structure", "taxes"]
    },
    {
      id: "2",
      question: "How much notice must a landlord give before entering my apartment?",
      answer: "Landlord entry notice requirements vary by state, but typically range from 24-48 hours advance notice. The entry must be during reasonable hours (usually daytime) and for legitimate purposes like repairs, inspections, or showing to prospective tenants. Emergency situations may allow immediate entry. Always check your local and state laws for specific requirements in your area.",
      category: "housing",
      tags: ["landlord", "tenant rights", "privacy", "notice"]
    },
    {
      id: "3",
      question: "Do I need a lawyer to create a will?",
      answer: "While not legally required, a lawyer is recommended for complex estates, significant assets, or complicated family situations. Simple wills can often be created using online tools or software, but must meet state requirements for witnessing and notarization. Consider a lawyer if you have minor children, own a business, have significant assets, or complex family dynamics.",
      category: "family",
      tags: ["will", "estate planning", "lawyer", "probate"]
    },
    {
      id: "4",
      question: "What makes a contract legally binding?",
      answer: "A legally binding contract requires: 1) Offer - one party proposes terms, 2) Acceptance - the other party agrees to those exact terms, 3) Consideration - something of value exchanged by both parties, 4) Legal capacity - parties must be legally able to enter contracts, 5) Legal purpose - the contract can't be for illegal activities. Written contracts are recommended for important agreements.",
      category: "contracts",
      tags: ["contract", "legally binding", "offer", "acceptance", "consideration"]
    },
    {
      id: "5",
      question: "Can I be fired without cause?",
      answer: "In most US states, employment is 'at-will,' meaning you can be fired for any reason or no reason, as long as it's not illegal discrimination. However, you cannot be fired for illegal reasons like race, gender, religion, filing workers' comp claims, or refusing to break the law. Some states have additional protections. Union contracts and employment agreements may provide additional job security.",
      category: "employment",
      tags: ["at-will employment", "wrongful termination", "discrimination", "firing"]
    },
    {
      id: "6",
      question: "How long do I have to file a personal injury claim?",
      answer: "Personal injury claims have a 'statute of limitations' that varies by state, typically ranging from 1-6 years from the date of injury. Most states have a 2-3 year limit. Some exceptions exist - discovery rule (when injury is discovered), minority (for children), or defendant leaving the state. It's crucial to consult an attorney promptly as missing the deadline usually bars your claim forever.",
      category: "family",
      tags: ["personal injury", "statute of limitations", "claim deadline", "lawsuit"]
    },
    {
      id: "7",
      question: "What should I include in a business contract?",
      answer: "Essential business contract elements include: 1) Parties' full legal names and addresses, 2) Detailed description of goods/services, 3) Payment terms and schedule, 4) Delivery/performance dates, 5) Termination clauses, 6) Dispute resolution procedures, 7) Force majeure provisions, 8) Intellectual property rights, 9) Confidentiality terms if needed, 10) Governing law and jurisdiction. Always have contracts reviewed by legal counsel.",
      category: "business",
      tags: ["business contract", "contract terms", "agreement", "legal requirements"]
    },
    {
      id: "8",
      question: "What's the difference between a security deposit and last month's rent?",
      answer: "A security deposit is held to cover potential damages or unpaid rent and must be returned (minus legitimate deductions) after you move out. Last month's rent is prepaid rent for your final month of tenancy. Security deposits often have legal limits (1-2 months' rent) and must be held in separate accounts in some states. They also have specific return timelines and itemization requirements for deductions.",
      category: "housing",
      tags: ["security deposit", "last month rent", "tenant", "rental agreement"]
    }
  ];

  const toggleFAQ = (faqId: string) => {
    setOpenFAQs(prev => 
      prev.includes(faqId) 
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    );
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Legal Knowledge Base</h3>
        <p className="text-slate-600">Find answers to frequently asked legal questions</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search legal questions and topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
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

      {/* FAQ Results */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-slate-600">No questions found matching your search criteria.</p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((faq) => {
            const isOpen = openFAQs.includes(faq.id);
            const categoryInfo = categories.find(c => c.id === faq.category);
            
            return (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-slate-50" onClick={() => toggleFAQ(faq.id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              {categoryInfo && <categoryInfo.icon className="h-3 w-3" />}
                              <span>{categoryInfo?.name}</span>
                            </Badge>
                            <div className="flex flex-wrap gap-1">
                              {faq.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {isOpen ? (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          <strong>Disclaimer:</strong> This information is for general guidance only. 
                          Laws vary by jurisdiction. Consult with a qualified attorney for advice specific to your situation.
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })
        )}
      </div>

      {/* Contact CTA */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="text-center py-6">
          <h4 className="text-lg font-medium text-blue-900 mb-2">Need Specific Legal Advice?</h4>
          <p className="text-blue-700 mb-4">Our knowledge base provides general information. For personalized legal counsel, connect with a qualified attorney.</p>
          <Button className="bg-blue-600 hover:bg-blue-700">Find a Lawyer</Button>
        </CardContent>
      </Card>
    </div>
  );
};
