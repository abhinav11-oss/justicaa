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
        description: "The supreme law of India. It lays down the framework defining the fundamental political code, structure, procedures, powers, and duties of government institutions. It also establishes fundamental rights, directive principles, and the duties of citizens, making it the longest written constitution of any country.",
        keySections: [
          { title: "Article 14: Equality before law", description: "This cornerstone of Indian democracy ensures that 'the State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.' It guarantees that all citizens are treated equally and that the law applies to everyone without discrimination." },
          { title: "Article 19: Protection of certain rights regarding freedom of speech, etc.", description: "Guarantees six fundamental freedoms to citizens: (a) freedom of speech and expression; (b) to assemble peaceably and without arms; (c) to form associations or unions; (d) to move freely throughout India; (e) to reside and settle in any part of India; and (f) to practice any profession or carry on any occupation. These rights are subject to reasonable restrictions." },
          { title: "Article 21: Protection of life and personal liberty", description: "A profoundly important article stating that 'no person shall be deprived of his life or personal liberty except according to a procedure established by law.' The Supreme Court has interpreted this to include the right to privacy, the right to a clean environment, the right to education, and many other implicit rights." },
          { title: "Article 32: Remedies for enforcement of rights", description: "Often called the 'heart and soul' of the Constitution, this article gives citizens the right to approach the Supreme Court directly for the enforcement of their fundamental rights through writs like Habeas Corpus, Mandamus, and Certiorari." },
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
        description: "The official criminal code of India, covering all substantive aspects of criminal law. It defines a vast range of offenses—from minor infractions like theft to serious crimes like murder—and prescribes the punishments for them, providing a unified penal code for the country.",
        keySections: [
          { title: "Section 302: Punishment for murder", description: "Prescribes the punishment for the offense of murder as defined in Section 300. The punishment can be the death penalty or imprisonment for life, along with a fine." },
          { title: "Section 376: Punishment for rape", description: "Details the punishment for the offense of rape, with stringent minimum sentences. The severity of the punishment varies based on the nature of the crime and the age of the victim." },
          { title: "Section 420: Cheating and dishonestly inducing delivery of property", description: "Deals with aggravated forms of cheating where a person is dishonestly induced to deliver any property. It is a widely cited section for financial fraud." },
          { title: "Section 498A: Husband or relative of husband of a woman subjecting her to cruelty", description: "A crucial provision designed to protect married women from domestic violence, harassment, and dowry-related abuse by their husbands or in-laws." },
        ],
      },
      {
        title: "Code of Criminal Procedure (CrPC), 1973",
        description: "The main legislation on the procedure for the administration of criminal law in India. It provides the machinery for the investigation of crimes, apprehension of suspects, collection of evidence, and the determination of guilt or innocence.",
        keySections: [
          { title: "Section 154: Information in cognizable cases (FIR)", description: "Governs the process of lodging a First Information Report (FIR). It mandates that police must register an FIR for any cognizable offense, which is the first step in setting the criminal justice process in motion." },
          { title: "Section 41: When police may arrest without warrant", description: "Specifies the conditions under which a police officer can arrest an individual without a warrant from a magistrate, typically for serious (cognizable) offenses." },
          { title: "Section 164: Recording of confessions and statements", description: "Lays down the formal procedure for a Judicial Magistrate to record a confession or statement during an investigation. A statement recorded under this section holds significant evidentiary value in court." },
        ],
      },
      {
        title: "Indian Evidence Act, 1872",
        description: "This act consolidates, defines, and amends the law of evidence. It governs the admissibility of evidence in Indian courts, defining what is relevant, what can be presented, and how it must be proven.",
        keySections: [
          { title: "Section 24: Confession caused by inducement, threat or promise", description: "Makes a confession inadmissible in a criminal proceeding if it appears to have been obtained through any inducement, threat, or promise from a person in authority, as it is considered involuntary and unreliable." },
          { title: "Section 32: Dying Declaration", description: "A statement made by a person about the cause of their death is admissible as evidence. It is based on the principle that a person on their deathbed is unlikely to lie, making it a powerful piece of evidence." },
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
        description: "A procedural law that governs the administration of civil proceedings in India. It outlines the entire lifecycle of a civil suit, from filing a case to its final appeal.",
        keySections: [
          { title: "Section 9: Courts to try all civil suits unless barred", description: "Establishes the fundamental jurisdiction of civil courts to hear all civil matters unless a specific law expressly or implicitly bars it." },
          { title: "Order 7: Plaint", description: "Details the necessary components and information that must be included in a plaint, which is the formal document filed by a plaintiff to initiate a lawsuit." },
        ],
      },
      {
        title: "Indian Contract Act, 1872",
        description: "The principal law that governs contracts in India. It defines the essential elements of a valid contract, and outlines the principles of performance, breach, and remedies.",
        keySections: [
          { title: "Section 10: What agreements are contracts", description: "Outlines the essential elements of a valid contract: free consent of competent parties, lawful consideration, a lawful object, and not being expressly declared void." },
          { title: "Section 73: Compensation for loss or damage caused by breach of contract", description: "Provides the primary remedy for a breach of contract, stating that the suffering party is entitled to compensation for any loss or damage that naturally arose from the breach." },
        ],
      },
      {
        title: "Transfer of Property Act, 1882",
        description: "Regulates the transfer of property between living persons in India. It contains specific provisions for sale, mortgage, lease, exchange, and gift of property.",
        keySections: [
          { title: "Section 5: 'Transfer of property' defined", description: "Defines 'transfer of property' as an act by which a living person conveys property to one or more other living persons, or to himself and one or more other living persons." },
          { title: "Section 54: 'Sale' defined", description: "Defines a sale as a transfer of ownership in exchange for a price. For immovable property of value one hundred rupees and upwards, it can be made only by a registered instrument." },
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
        description: "The primary legislation that governs the incorporation of a company, responsibilities of a company, directors, and dissolution of a company.",
        keySections: [
          { title: "Section 3: Formation of company", description: "Lays down the requirements for forming public (minimum 7 members) and private (minimum 2 members) companies, including a One Person Company." },
          { title: "Section 135: Corporate Social Responsibility (CSR)", description: "Mandates that companies of a certain net worth, turnover, or profit must spend at least 2% of their average net profits on CSR activities." },
        ],
      },
      {
        title: "Limited Liability Partnership Act, 2008",
        description: "Governs the formation and regulation of Limited Liability Partnerships (LLPs), a hybrid business structure that combines the features of a partnership and a company.",
        keySections: [
          { title: "Section 3: Limited liability partnership to be a body corporate", description: "Establishes an LLP as a separate legal entity from its partners, meaning the LLP can own property and sue or be sued in its own name." },
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
        description: "This code consolidates and amends the laws relating to wages, bonuses, and related matters. It aims to simplify and modernize labor regulations.",
        keySections: [
          { title: "Section 5: Minimum wages", description: "Empowers the central and state governments to fix minimum wages for employees, ensuring a basic standard of living." },
        ],
      },
      {
        title: "Industrial Relations Code, 2020",
        description: "Consolidates laws relating to Trade Unions, conditions of employment, and the investigation and settlement of industrial disputes.",
        keySections: [
          { title: "Chapter V: Strikes and Lock-outs", description: "Regulates the process for legal strikes and lock-outs, including notice periods, to ensure industrial peace and order." },
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
        description: "The primary law in India dealing with cybercrime and electronic commerce. It provides legal recognition for transactions carried out by means of electronic data interchange.",
        keySections: [
          { title: "Section 43A: Compensation for failure to protect data", description: "Makes corporate bodies liable to pay damages if they are negligent in implementing reasonable security practices to protect sensitive personal data." },
          { title: "Section 66: Computer related offences", description: "Defines and prescribes punishment for hacking, including imprisonment and fines." },
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
        description: "An act to protect the interests of consumers by establishing authorities for timely and effective administration and settlement of consumers' disputes.",
        keySections: [
          { title: "Section 2(9): Definition of 'consumer'", description: "Defines who qualifies as a consumer, which is crucial for determining who can file a complaint under the act." },
          { title: "Section 35: Manner in which complaint shall be made", description: "Specifies the procedure for filing a complaint with the District, State, or National Consumer Disputes Redressal Commissions." },
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