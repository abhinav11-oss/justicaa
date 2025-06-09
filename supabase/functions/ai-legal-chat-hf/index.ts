
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    console.log('Processing legal query:', message);

    // Build a comprehensive legal prompt
    const legalSystemPrompt = `You are an expert Virtual Legal Assistant with extensive knowledge of law. Provide detailed, helpful, and specific legal information while being clear that this is general guidance, not legal advice for specific cases.

Guidelines:
- Give comprehensive, detailed responses that directly address the user's question
- Provide specific legal concepts, procedures, and considerations
- Include relevant laws, regulations, or legal principles when applicable
- Explain legal processes step-by-step when relevant
- Offer practical guidance and next steps
- Always include the disclaimer about consulting an attorney for specific cases
- Be helpful and informative, not just generic`;

    // Create a detailed prompt for better responses
    let fullPrompt = legalSystemPrompt + "\n\n";
    
    // Add conversation history for context
    if (conversationHistory.length > 0) {
      fullPrompt += "Previous conversation:\n";
      conversationHistory.slice(-3).forEach((msg: any) => {
        fullPrompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      fullPrompt += "\n";
    }
    
    fullPrompt += `User Question: ${message}\n\nProvide a detailed, helpful legal response:`;

    // Try multiple free AI APIs for better responses
    let aiResponse = null;

    // First try: Hugging Face Inference API with a more capable model
    try {
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            do_sample: true,
            return_full_text: false,
            pad_token_id: 50256
          }
        }),
      });

      if (hfResponse.ok) {
        const hfData = await hfResponse.json();
        if (Array.isArray(hfData) && hfData[0]?.generated_text) {
          aiResponse = hfData[0].generated_text.trim();
        }
      }
    } catch (error) {
      console.log('Hugging Face API failed, trying alternative...');
    }

    // Fallback: Use a more sophisticated rule-based system
    if (!aiResponse || aiResponse.length < 50) {
      aiResponse = generateDetailedLegalResponse(message, conversationHistory);
    }

    // Clean up the response
    aiResponse = cleanupResponse(aiResponse);

    // Ensure response has legal disclaimer
    if (!aiResponse.toLowerCase().includes('legal advice') && !aiResponse.toLowerCase().includes('attorney')) {
      aiResponse += "\n\nImportant: This is general legal information only and not legal advice for your specific situation. Please consult with a qualified attorney for personalized legal advice.";
    }

    // Categorize the response
    const category = categorizeResponse(aiResponse, message);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      category: category 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-legal-chat-hf function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize for the technical difficulty. However, I can still help with your legal question. Could you please rephrase your question, and I'll do my best to provide helpful legal information."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateDetailedLegalResponse(message: string, conversationHistory: any[] = []): string {
  const lowerMessage = message.toLowerCase();
  
  // Contract-related questions
  if (lowerMessage.includes('contract') || lowerMessage.includes('agreement') || lowerMessage.includes('breach')) {
    if (lowerMessage.includes('breach')) {
      return `A contract breach occurs when one party fails to fulfill their obligations under a legally binding agreement. There are several types of breaches:

**Material Breach**: A significant failure that defeats the purpose of the contract, allowing the non-breaching party to terminate and seek damages.

**Minor Breach**: A partial failure that doesn't destroy the contract's value, typically remedied through damages.

**Anticipatory Breach**: When one party indicates they won't perform before the performance date.

**Steps if you believe there's a breach:**
1. Review the contract terms carefully
2. Document the alleged breach with evidence
3. Check for any cure periods or notice requirements
4. Consider sending a formal demand letter
5. Calculate potential damages
6. Explore resolution options (negotiation, mediation, arbitration)

**Potential remedies include:**
- Monetary damages (compensatory, consequential, or punitive)
- Specific performance (forcing completion)
- Contract cancellation and restitution

The specific remedies available depend on your contract terms, jurisdiction, and the nature of the breach.`;
    } else {
      return `Contract law governs legally binding agreements between parties. For a valid contract, you need:

**Essential Elements:**
1. **Offer**: A clear proposal with definite terms
2. **Acceptance**: Unqualified agreement to the offer
3. **Consideration**: Something of value exchanged by both parties
4. **Capacity**: Legal ability to enter contracts (age, mental capacity)
5. **Legality**: The contract purpose must be lawful

**Types of Contracts:**
- Written vs. Oral (some must be written under Statute of Frauds)
- Bilateral (mutual promises) vs. Unilateral (promise for performance)
- Express (clearly stated) vs. Implied (inferred from conduct)

**Important Considerations:**
- Contracts involving real estate, goods over $500, or agreements lasting over one year typically must be written
- Include clear terms for performance, payment, deadlines, and dispute resolution
- Consider including force majeure clauses for unforeseen circumstances
- Review applicable state laws as contract law varies by jurisdiction

**Red flags to avoid:**
- Unconscionable terms, fraud, duress, or undue influence
- Ambiguous language that could lead to disputes`;
    }
  }

  // Business law questions
  if (lowerMessage.includes('business') || lowerMessage.includes('llc') || lowerMessage.includes('corporation') || lowerMessage.includes('startup')) {
    return `Business formation is a crucial decision that affects your liability, taxes, and operations. Here's a comprehensive overview:

**Business Entity Types:**

**LLC (Limited Liability Company):**
- Personal asset protection from business debts
- Flexible tax options (pass-through or corporate taxation)
- Fewer formalities than corporations
- Good for small to medium businesses

**Corporation (C-Corp):**
- Strong liability protection
- Can raise capital through stock sales
- Double taxation (corporate and personal levels)
- Required board meetings and formal record-keeping

**S-Corporation:**
- Pass-through taxation (avoids double taxation)
- Limited to 100 shareholders, all must be US citizens/residents
- More restrictions than LLCs but potential tax savings

**Partnership:**
- Simple formation but personal liability for all debts
- Pass-through taxation
- Consider Limited Partnerships (LP) for liability protection

**Formation Steps:**
1. Choose and reserve your business name
2. File formation documents with your state
3. Obtain required licenses and permits
4. Get an EIN (Employer Identification Number) from the IRS
5. Open a business bank account
6. Create operating agreements or bylaws
7. Consider trademark protection for your business name/logo

**Ongoing Compliance:**
- Annual state filings and fees
- Proper record-keeping and meeting minutes
- Separate business and personal finances
- Required insurance (general liability, professional liability, etc.)`;
  }

  // Employment law questions
  if (lowerMessage.includes('employment') || lowerMessage.includes('workplace') || lowerMessage.includes('fired') || lowerMessage.includes('discrimination')) {
    return `Employment law protects both employees and employers through federal and state regulations:

**Key Federal Employment Laws:**
- **Title VII**: Prohibits discrimination based on race, color, religion, sex, or national origin
- **ADA**: Requires reasonable accommodations for qualified individuals with disabilities
- **FMLA**: Provides unpaid leave for family/medical reasons (eligible employees)
- **FLSA**: Governs minimum wage, overtime, and child labor standards
- **OSHA**: Ensures safe working conditions

**At-Will Employment:**
Most US employment is "at-will," meaning either party can terminate without cause, BUT there are important exceptions:
- Cannot fire for illegal reasons (discrimination, retaliation, whistleblowing)
- Must follow company policies and procedures
- Cannot violate employment contracts or union agreements

**If You Face Workplace Issues:**
1. **Document everything**: Keep records of incidents, emails, witnesses
2. **Follow company procedures**: Use internal grievance processes first
3. **Know your rights**: Research applicable laws and company policies
4. **File complaints**: EEOC for discrimination, Department of Labor for wage issues
5. **Time limits**: Most complaints have strict deadlines (180-300 days typically)

**Common Issues:**
- **Wrongful termination**: Firing for illegal reasons
- **Wage theft**: Unpaid overtime, meal break violations
- **Hostile work environment**: Severe, pervasive discriminatory conduct
- **Retaliation**: Punishment for exercising legal rights

**When to Contact an Attorney:**
- Complex discrimination cases
- Significant financial losses
- Unclear legal rights
- Employer refuses to address serious violations`;
  }

  // Family law questions
  if (lowerMessage.includes('family') || lowerMessage.includes('divorce') || lowerMessage.includes('custody') || lowerMessage.includes('child support')) {
    return `Family law encompasses various personal relationships and domestic matters:

**Divorce Proceedings:**
- **No-fault divorce**: Available in all states, citing irreconcilable differences
- **Fault-based divorce**: Adultery, abandonment, abuse (varies by state)
- **Property division**: Equitable distribution vs. community property states
- **Alimony/Spousal support**: Based on factors like marriage length, earning capacity, standard of living

**Child Custody and Support:**
**Types of Custody:**
- **Legal custody**: Decision-making authority for child's welfare
- **Physical custody**: Where the child primarily lives
- **Joint vs. sole custody**: Shared or exclusive arrangements

**Best Interest Standard**: Courts consider:
- Child's physical and emotional needs
- Parents' ability to provide stable environment
- Existing parent-child relationships
- Child's preferences (age-appropriate)
- History of domestic violence or substance abuse

**Child Support Calculations:**
- Based on state guidelines considering both parents' incomes
- Covers basic needs: housing, food, clothing, healthcare, education
- Can be modified if circumstances change significantly

**Estate Planning:**
- **Wills**: Distribute property, name guardians for minor children
- **Trusts**: Manage assets, avoid probate, provide for beneficiaries
- **Power of Attorney**: Authorize someone to make decisions if incapacitated
- **Advanced Directives**: Healthcare wishes if unable to communicate

**Adoption Process:**
- Home studies and background checks
- Consent requirements from biological parents
- Court approval and finalization
- Different rules for stepparent, international, and agency adoptions`;
  }

  // Real estate questions
  if (lowerMessage.includes('real estate') || lowerMessage.includes('property') || lowerMessage.includes('landlord') || lowerMessage.includes('tenant') || lowerMessage.includes('lease')) {
    return `Real estate law governs property transactions and landlord-tenant relationships:

**Property Transactions:**
**Purchase Process:**
1. **Purchase Agreement**: Defines terms, price, contingencies, closing date
2. **Title Search**: Ensures clear ownership and identifies liens
3. **Property Inspection**: Identifies defects that may affect value
4. **Financing**: Mortgage approval and terms
5. **Closing**: Final transfer of ownership and keys

**Key Contingencies:**
- Financing approval
- Satisfactory inspection results
- Clear title
- Appraisal meeting purchase price

**Landlord-Tenant Law:**
**Landlord Responsibilities:**
- Maintain habitable conditions (heat, water, electricity)
- Make necessary repairs for health and safety
- Follow proper procedures for rent increases and evictions
- Return security deposits within statutory timeframes
- Provide quiet enjoyment of the property

**Tenant Rights:**
- Right to habitable housing
- Privacy rights (proper notice for entry)
- Protection against discriminatory practices
- Right to reasonable accommodations for disabilities
- Protection against retaliatory eviction

**Common Issues:**
**Security Deposits:**
- Limits on amounts (typically 1-2 months' rent)
- Required to be held in separate accounts in some states
- Itemized deductions for actual damages beyond normal wear

**Eviction Process:**
- Must follow state-specific procedures
- Proper notice requirements (pay or quit, cure or quit)
- Cannot use "self-help" evictions (changing locks, shutting utilities)
- Court proceedings required for legal eviction

**Property Disputes:**
- Boundary disputes and easements
- Neighbor issues (noise, trees, fences)
- Homeowners association violations
- Construction defects and contractor disputes`;
  }

  // Personal injury questions
  if (lowerMessage.includes('injury') || lowerMessage.includes('accident') || lowerMessage.includes('negligence') || lowerMessage.includes('liability')) {
    return `Personal injury law allows injured parties to seek compensation for harm caused by others' negligence or intentional actions:

**Elements of Negligence:**
1. **Duty of Care**: Defendant owed plaintiff a legal duty
2. **Breach**: Defendant failed to meet the standard of care
3. **Causation**: Breach directly caused the injury
4. **Damages**: Plaintiff suffered actual harm or losses

**Types of Personal Injury Cases:**
- **Motor vehicle accidents**: Cars, trucks, motorcycles, pedestrians
- **Slip and fall**: Property owner negligence
- **Medical malpractice**: Healthcare provider errors
- **Product liability**: Defective or dangerous products
- **Workplace injuries**: Workers' compensation claims
- **Dog bites**: Owner liability for pet attacks

**Compensation Types:**
**Economic Damages:**
- Medical expenses (past and future)
- Lost wages and earning capacity
- Property damage
- Rehabilitation costs

**Non-Economic Damages:**
- Pain and suffering
- Emotional distress
- Loss of enjoyment of life
- Loss of consortium (relationship impact)

**Important Considerations:**
**Statute of Limitations:**
- Typically 2-3 years from injury date (varies by state and case type)
- Discovery rule may extend deadline for unknown injuries
- Missing deadlines can bar your claim entirely

**Comparative/Contributory Negligence:**
- Your own fault may reduce or eliminate recovery
- Pure comparative: Recovery reduced by your percentage of fault
- Modified comparative: No recovery if you're 50%+ at fault
- Contributory negligence: Any fault eliminates recovery (few states)

**Insurance Considerations:**
- Notify your insurance company promptly
- Be careful with recorded statements
- Understand policy limits and coverage types
- Uninsured/underinsured motorist coverage importance`;
  }

  // Criminal law questions
  if (lowerMessage.includes('criminal') || lowerMessage.includes('arrest') || lowerMessage.includes('charges') || lowerMessage.includes('police')) {
    return `Criminal law involves prosecution of individuals who violate laws that protect public safety and order:

**Your Constitutional Rights:**
**4th Amendment**: Protection against unreasonable searches and seizures
- Police need warrant or probable cause for searches
- Exceptions: plain view, consent, exigent circumstances, vehicle searches

**5th Amendment**: Protection against self-incrimination
- Right to remain silent
- Cannot be forced to testify against yourself
- Protection against double jeopardy

**6th Amendment**: Right to counsel and fair trial
- Right to attorney (provided if indigent)
- Right to speedy and public trial
- Right to confront witnesses

**If Arrested:**
1. **Exercise your right to remain silent** - Don't answer questions without attorney
2. **Request an attorney immediately** - Clearly state "I want a lawyer"
3. **Don't consent to searches** - Say "I do not consent to any searches"
4. **Stay calm and comply** - Don't resist even if arrest seems unlawful
5. **Remember details** - Note badge numbers, time, location, witnesses

**Criminal Process:**
1. **Investigation and Arrest**
2. **Initial Appearance**: Informed of charges, bail set
3. **Preliminary Hearing**: Determination of probable cause
4. **Arraignment**: Enter plea (guilty, not guilty, no contest)
5. **Discovery**: Exchange of evidence between parties
6. **Plea Negotiations**: Possible plea bargain discussions
7. **Trial**: If no plea agreement reached
8. **Sentencing**: If found guilty

**Types of Crimes:**
**Felonies**: Serious crimes punishable by more than one year in prison
**Misdemeanors**: Less serious crimes, typically under one year jail time
**Infractions**: Minor violations, usually fines only

**Defenses:**
- Self-defense or defense of others
- Alibi (you were elsewhere)
- Insanity or diminished capacity
- Duress or coercion
- Entrapment by law enforcement
- Statute of limitations expired`;
  }

  // Intellectual property questions
  if (lowerMessage.includes('intellectual property') || lowerMessage.includes('trademark') || lowerMessage.includes('copyright') || lowerMessage.includes('patent')) {
    return `Intellectual Property (IP) law protects creations of the mind and provides exclusive rights to creators:

**Types of Intellectual Property:**

**Copyright:**
- **Protects**: Original works of authorship (books, music, art, software, etc.)
- **Duration**: Life of author + 70 years (works for hire: 95 years from publication)
- **Rights**: Reproduction, distribution, public performance, derivative works
- **Automatic**: Protection begins when work is fixed in tangible form
- **Registration**: Not required but provides additional legal benefits

**Trademarks:**
- **Protects**: Words, phrases, symbols, designs that identify goods/services
- **Duration**: Indefinite if properly maintained and used
- **Rights**: Exclusive use in connection with specific goods/services
- **Requirements**: Must be distinctive and used in commerce
- **Registration**: Federal registration provides nationwide protection

**Patents:**
- **Protects**: Inventions, processes, machines, compositions of matter
- **Duration**: 20 years from filing date
- **Requirements**: Novel, non-obvious, useful
- **Types**: Utility (most common), design, plant patents
- **Process**: Extensive examination by USPTO, can take years

**Trade Secrets:**
- **Protects**: Confidential business information providing competitive advantage
- **Duration**: As long as kept secret
- **Examples**: Formulas, customer lists, manufacturing processes
- **Protection**: Non-disclosure agreements, limited access, security measures

**Common IP Issues:**
**Infringement**: Unauthorized use of protected IP
- **Copyright**: Copying substantial portions without permission
- **Trademark**: Likelihood of consumer confusion
- **Patent**: Making, using, selling patented invention without license

**Fair Use (Copyright):**
- Limited use for criticism, comment, news reporting, teaching, research
- Factors: Purpose, nature of work, amount used, effect on market

**Enforcement:**
- Cease and desist letters
- DMCA takedown notices for online infringement
- Federal court litigation
- International protection through treaties

**Business Considerations:**
- Conduct clearance searches before adopting marks
- Document creation processes for copyright claims
- Use proper notices (© for copyright, ® for registered trademarks)
- Implement IP policies for employees and contractors`;
  }

  // Default comprehensive response for general questions
  return `I understand you have a legal question, and I'm here to provide helpful information. Let me address your inquiry with specific legal guidance:

**Understanding Your Legal Situation:**
Every legal matter has unique circumstances that affect the applicable laws and potential outcomes. Based on your question, here are the key legal concepts and considerations:

**Relevant Legal Framework:**
- Federal and state laws may both apply to your situation
- Court precedents (case law) influence how laws are interpreted
- Local regulations and ordinances may also be relevant
- Statute of limitations may affect your ability to take legal action

**Steps You Can Take:**
1. **Document everything**: Keep detailed records of relevant events, communications, and evidence
2. **Research applicable laws**: Look up relevant statutes and regulations in your jurisdiction
3. **Understand your rights**: Know what legal protections and remedies may be available
4. **Consider time limits**: Many legal actions have specific deadlines
5. **Evaluate your options**: Weigh the costs, benefits, and likelihood of success for different approaches

**When Professional Help is Needed:**
- Complex legal issues requiring specialized knowledge
- Situations involving significant financial stakes
- Cases where court representation is necessary
- Time-sensitive matters with strict deadlines
- Disputes that cannot be resolved through negotiation

**Resources for Further Assistance:**
- State bar associations often provide lawyer referral services
- Legal aid organizations for those with limited income
- Self-help legal resources and court websites
- Mediation and arbitration for dispute resolution

**Important Legal Principles:**
- Know your rights and responsibilities under applicable laws
- Understand that legal remedies vary based on specific circumstances
- Be aware that court procedures have strict requirements and deadlines
- Consider both legal and practical aspects of your situation

To provide more specific guidance, I would need additional details about your particular circumstances. Feel free to ask follow-up questions about specific aspects of your legal issue.`;
}

function cleanupResponse(response: string): string {
  // Remove any unwanted prefixes or AI-generated artifacts
  response = response.replace(/^(Assistant:|AI:|Legal Assistant:|Response:)/gi, '');
  response = response.replace(/^[\s:]+/, '');
  
  // Remove any incomplete sentences at the end
  const sentences = response.split(/[.!?]+/);
  if (sentences.length > 1 && sentences[sentences.length - 1].trim().length < 10) {
    sentences.pop();
    response = sentences.join('.') + '.';
  }
  
  return response.trim();
}

function categorizeResponse(response: string, question: string): string {
  const content = (response + ' ' + question).toLowerCase();
  
  if (content.includes('business') || content.includes('llc') || content.includes('corporation')) {
    return 'business';
  } else if (content.includes('contract') || content.includes('agreement') || content.includes('breach')) {
    return 'contract';
  } else if (content.includes('family') || content.includes('divorce') || content.includes('custody')) {
    return 'family';
  } else if (content.includes('real estate') || content.includes('property') || content.includes('landlord')) {
    return 'real-estate';
  } else if (content.includes('employment') || content.includes('workplace') || content.includes('fired')) {
    return 'employment';
  } else if (content.includes('intellectual property') || content.includes('trademark') || content.includes('copyright')) {
    return 'intellectual-property';
  } else if (content.includes('criminal') || content.includes('arrest') || content.includes('charges')) {
    return 'criminal';
  } else if (content.includes('injury') || content.includes('accident') || content.includes('negligence')) {
    return 'personal-injury';
  } else {
    return 'general';
  }
}
