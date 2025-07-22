import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Search, Gavel, Landmark, Shield, Building, Users, Home, Briefcase, Laptop } from "lucide-react";

const lawCategories = [
  {
    id: "constitutional",
    name: "Constitutional Law",
    icon: Landmark,
    acts: [
      {
        title: "The Constitution of India, 1950",
        description: "The supreme law of India, laying down the framework defining fundamental political code, structure, procedures, powers, and duties of government institutions and sets out fundamental rights, directive principles, and the duties of citizens.",
        keySections: [
          { title: "Article 14: Equality before law", description: "Ensures that every person is equal before the law and has equal protection of the laws within the territory of India." },
          { title: "Article 19: Protection of certain rights regarding freedom of speech, etc.", description: "Guarantees six fundamental freedoms to citizens, including freedom of speech and expression." },
          { title: "Article 21: Protection of life and personal liberty", description: "States that no person shall be deprived of his life or personal liberty except according to a procedure established by law." },
          { title: "Article 32: Remedies for enforcement of rights", description: "Guarantees the right to move the Supreme Court for the enforcement of fundamental rights." },
        ],
      },
    ],
  },
  {
    id: "criminal",
    name: "Criminal Law",
    icon: Gavel,
    acts: [
      {
        title: "Indian Penal Code (IPC), 1860",
        description: "The official criminal code of India. It is a comprehensive code intended to cover all substantive aspects of criminal law.",
        keySections: [
          { title: "Section 302: Punishment for murder", description: "Prescribes the punishment for the offense of murder, which can be death or imprisonment for life." },
          { title: "Section 376: Punishment for rape", description: "Details the punishment for the offense of rape, with varying degrees based on the severity of the crime." },
          { title: "Section 420: Cheating and dishonestly inducing delivery of property", description: "Deals with the offense of cheating, a common white-collar crime." },
          { title: "Section 498A: Husband or relative of husband of a woman subjecting her to cruelty", description: "A provision to protect women from domestic violence and harassment." },
        ],
      },
      {
        title: "Code of Criminal Procedure (CrPC), 1973",
        description: "The main legislation on procedure for administration of substantive criminal law in India.",
        keySections: [
          { title: "Section 154: Information in cognizable cases (FIR)", description: "Governs the process of lodging a First Information Report (FIR) with the police." },
          { title: "Section 41: When police may arrest without warrant", description: "Specifies the conditions under which a police officer can make an arrest without a warrant from a magistrate." },
          { title: "Section 164: Recording of confessions and statements", description: "Lays down the procedure for a Magistrate to record confessions and statements during an investigation." },
        ],
      },
      {
        title: "Indian Evidence Act, 1872",
        description: "Consolidates, defines, and amends the law of evidence in India.",
        keySections: [
          { title: "Section 24: Confession caused by inducement, threat or promise", description: "Makes a confession irrelevant in a criminal proceeding if it appears to have been caused by any inducement, threat, or promise." },
          { title: "Section 32: Dying Declaration", description: "Deals with the admissibility of a statement made by a person as to the cause of his death, or as to any of the circumstances of the transaction which resulted in his death." },
        ],
      },
    ],
  },
  {
    id: "civil",
    name: "Civil & Property Law",
    icon: Home,
    acts: [
      {
        title: "Code of Civil Procedure (CPC), 1908",
        description: "A procedural law related to the administration of civil proceedings in India.",
        keySections: [
          { title: "Section 9: Courts to try all civil suits unless barred", description: "Establishes the jurisdiction of civil courts to hear all civil matters." },
          { title: "Order 7: Plaint", description: "Details the particulars that must be contained in a plaint (the statement of claim filed by a plaintiff)." },
        ],
      },
      {
        title: "Indian Contract Act, 1872",
        description: "The principal law that governs contracts in India.",
        keySections: [
          { title: "Section 10: What agreements are contracts", description: "Outlines the essential elements of a valid contract, such as free consent, lawful consideration, and lawful object." },
          { title: "Section 73: Compensation for loss or damage caused by breach of contract", description: "Provides for remedies in case of a breach of contract." },
        ],
      },
      {
        title: "Transfer of Property Act, 1882",
        description: "Regulates the transfer of property in India. It contains specific provisions regarding what constitutes a transfer and the conditions attached to it.",
        keySections: [
          { title: "Section 5: 'Transfer of property' defined", description: "Defines transfer of property as an act by which a living person conveys property, in present or in future, to one or more other living persons." },
          { title: "Section 54: 'Sale' defined", description: "Defines sale as a transfer of ownership in exchange for a price paid or promised or part-paid and part-promised." },
        ],
      },
    ],
  },
  {
    id: "corporate",
    name: "Corporate & Business Law",
    icon: Building,
    acts: [
      {
        title: "Companies Act, 2013",
        description: "An Act to consolidate and amend the law relating to companies.",
        keySections: [
          { title: "Section 3: Formation of company", description: "Lays down the requirements for the formation of public and private companies." },
          { title: "Section 135: Corporate Social Responsibility (CSR)", description: "Mandates that companies of a certain size must spend a portion of their profits on CSR activities." },
        ],
      },
      {
        title: "Limited Liability Partnership Act, 2008",
        description: "Governs the formation and regulation of Limited Liability Partnerships (LLPs).",
        keySections: [
          { title: "Section 3: Limited liability partnership to be a body corporate", description: "Establishes an LLP as a separate legal entity from its partners." },
        ],
      },
    ],
  },
  {
    id: "labour",
    name: "Labour & Employment Law",
    icon: Users,
    acts: [
      {
        title: "Code on Wages, 2019",
        description: "Amends and consolidates the laws relating to wages and bonuses and matters connected therewith.",
        keySections: [
          { title: "Section 5: Minimum wages", description: "Empowers the central and state governments to fix minimum wages for employees." },
        ],
      },
      {
        title: "Industrial Relations Code, 2020",
        description: "Consolidates and amends the laws relating to Trade Unions, conditions of employment in industrial establishment or undertaking, investigation and settlement of industrial disputes.",
        keySections: [
          { title: "Chapter V: Strikes and Lock-outs", description: "Regulates the process and legality of strikes and lock-outs." },
        ],
      },
    ],
  },
  {
    id: "it",
    name: "Information Technology Law",
    icon: Laptop,
    acts: [
      {
        title: "Information Technology Act, 2000",
        description: "The primary law in India dealing with cybercrime and electronic commerce.",
        keySections: [
          { title: "Section 43A: Compensation for failure to protect data", description: "Makes corporate bodies liable to pay damages if they are negligent in implementing and maintaining reasonable security practices and procedures, resulting in wrongful loss or gain." },
          { title: "Section 66: Computer related offences", description: "Defines hacking and prescribes punishment for it." },
        ],
      },
    ],
  },
  {
    id: "consumer",
    name: "Consumer Rights",
    icon: Shield,
    acts: [
      {
        title: "Consumer Protection Act, 2019",
        description: "An act to provide for the protection of the interests of consumers.",
        keySections: [
          { title: "Section 2(9): Definition of 'consumer'", description: "Defines who qualifies as a consumer under the act." },
          { title: "Section 35: Manner in which complaint shall be made", description: "Specifies the procedure for filing a complaint in a Consumer Commission." },
        ],
      },
    ],
  },
];

export const IndianLawsExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = lawCategories.map(category => ({
    ...category,
    acts: category.acts.filter(act => 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.keySections.some(section => section.title.toLowerCase().includes(searchQuery.toLowerCase()) || section.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.acts.length > 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Indian Laws Explorer</h3>
        <p className="text-muted-foreground">A guide to key legislation in India</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search for laws or sections (e.g., 'IPC 302', 'Contract Act')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Accordion type="multiple" className="w-full space-y-4">
        {filteredCategories.map(category => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {category.acts.map(act => (
                  <AccordionItem key={act.title} value={act.title}>
                    <AccordionTrigger className="text-left font-semibold">{act.title}</AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <p className="text-muted-foreground mb-4">{act.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Key Sections:</h4>
                        {act.keySections.map(section => (
                          <div key={section.title} className="p-2 rounded-md bg-muted/50">
                            <p className="font-semibold text-sm">{section.title}</p>
                            <p className="text-xs text-muted-foreground">{section.description}</p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </Accordion>
      {filteredCategories.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No laws found matching your search.</p>
      )}
    </div>
  );
};