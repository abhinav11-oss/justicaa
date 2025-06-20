
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

    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    // Build comprehensive Indian legal system prompt
    const indianLegalSystemPrompt = `🎯 You are a highly knowledgeable and responsible Indian legal assistant trained on real Indian laws and procedures.

Your goal is to help Indian citizens by providing accurate, actionable, and easy-to-understand legal answers across various domains like:

• IPC (Indian Penal Code)
• RTI (Right to Information Act) 
• NDPS Act
• Consumer Protection Act
• Fundamental Rights
• Civil Procedures
• Police Complaints
• Family Law (Hindu Marriage Act, etc.)
• Property Law
• Labour Law
• Constitutional Law
• Criminal Procedure Code (CrPC)
• Civil Procedure Code (CPC)

🔍 When a user asks a question, always:
1. Identify the applicable Indian law or legal context
2. Explain the rights or legal steps in simple, clear language
3. Guide them with specific next actions (filing RTI, lodging complaint, approaching legal body)
4. Mention which government body, court, or authority handles the issue
5. Provide relevant section numbers from applicable acts when helpful
6. Suggest approximate timelines for legal processes where known

Important Guidelines:
• Always prioritize Indian legal jurisdiction and procedures
• Use simple Hindi/English terms that common people understand
• Never provide misinformation - clearly say "I'm not certain about this specific detail" if unsure
• Always include disclaimer about consulting qualified lawyers for complex cases
• Respect user privacy and data protection
• Focus on empowering citizens with knowledge of their legal rights

Remember: You're helping Indian citizens navigate their legal system effectively.`;

    // Create conversation context
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext = "\n\nPrevious conversation context:\n";
      conversationHistory.slice(-3).forEach((msg: any) => {
        conversationContext += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    // Prepare the full prompt
    const fullPrompt = `${indianLegalSystemPrompt}${conversationContext}\n\nUser's Legal Question: ${message}\n\nProvide a comprehensive, helpful response following the guidelines above:`;

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    let aiResponse = null;
    if (geminiData.candidates && geminiData.candidates[0]?.content?.parts?.[0]?.text) {
      aiResponse = geminiData.candidates[0].content.parts[0].text.trim();
    }

    // Fallback to Indian legal knowledge base if Gemini fails
    if (!aiResponse || aiResponse.length < 50) {
      aiResponse = generateIndianLegalResponse(message);
    }

    // Ensure Indian legal disclaimer is included
    if (!aiResponse.toLowerCase().includes('qualified lawyer') && !aiResponse.toLowerCase().includes('legal advice')) {
      aiResponse += "\n\n⚖️ Important: This is general legal information based on Indian laws. For complex cases or specific legal advice, please consult with a qualified Indian lawyer or advocate.";
    }

    // Categorize based on Indian legal domains
    const category = categorizeIndianLegalResponse(aiResponse, message);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      category: category 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Indian legal AI function:', error);
    
    // Provide helpful fallback response
    const fallbackResponse = `मुझे खुशी होगी आपकी कानूनी सहायता करने में! (I'd be happy to assist with your legal query!)

Unfortunately, I'm experiencing a technical issue right now. However, here are some immediate steps you can take:

🏛️ **For Constitutional/Fundamental Rights Issues:**
- Contact your nearest Legal Aid Cell
- File a complaint with the National Human Rights Commission (NHRC)

📄 **For RTI Queries:**
- Visit rtionline.gov.in for online RTI filing
- Contact your State Information Commission

👮 **For Police/Criminal Matters:**
- Visit your nearest police station
- Use the online complaint portal of your state police

🏪 **For Consumer Issues:**
- File a complaint with the National Consumer Helpline: 1915
- Visit consumerhelpline.gov.in

For immediate legal assistance, contact your nearest Legal Services Authority or dial 1968 for legal aid.`;

    return new Response(JSON.stringify({ 
      error: error.message,
      response: fallbackResponse 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateIndianLegalResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // RTI (Right to Information) queries
  if (lowerMessage.includes('rti') || lowerMessage.includes('right to information') || lowerMessage.includes('information act')) {
    return `📄 **Right to Information (RTI) Act, 2005**

The RTI Act empowers every Indian citizen to seek information from public authorities.

**Your Rights under RTI:**
- Access to information held by public authorities
- Obtain certified copies of documents  
- Inspect government works and documents
- Take notes, extracts or certified copies

**How to File RTI:**
1. **Online**: Visit rtionline.gov.in or your state's RTI portal
2. **Offline**: Submit application to concerned Public Information Officer (PIO)
3. **Fee**: ₹10 for Central Govt, varies for states (free for BPL cardholders)
4. **Timeline**: 30 days for response (48 hours for life/liberty matters)

**Key Information:**
- **Section 4**: Proactive disclosure by departments
- **Section 6**: How to request information  
- **Section 7**: Time limits for disposal
- **Section 18**: Appellate authorities

**Contact:**
- Central Information Commission (CIC) for central govt matters
- State Information Commission for state govt matters

**Next Steps:**
1. Identify the concerned department/ministry
2. Draft your RTI application clearly stating information needed
3. Submit with prescribed fee
4. If no response, file first appeal with Appellate Authority

Remember: RTI doesn't apply to private bodies unless they're substantially funded by government.`;
  }

  // Police complaints and criminal matters
  if (lowerMessage.includes('police') || lowerMessage.includes('fir') || lowerMessage.includes('arrest') || lowerMessage.includes('criminal')) {
    return `👮 **Police Complaints & Criminal Procedures**

**Your Rights during Police Interaction:**

**If Arrested:**
- **Article 22**: Right to know grounds of arrest
- **Section 50, CrPC**: Right to inform someone about arrest
- **Section 56**: Medical examination if arrested for assault on woman
- **Right to Lawyer**: Cannot be denied legal representation

**Filing FIR:**
- **Section 154, CrPC**: Police must register FIR for cognizable offenses
- **Free of Cost**: No fee for FIR registration
- **Copy**: You have right to free copy of FIR
- **Online**: Many states allow online FIR for certain offenses

**If Police Refuses FIR:**
1. Send written complaint by registered post
2. Approach Superintendent of Police
3. File complaint under Section 156(3) CrPC in Magistrate Court
4. Contact State Human Rights Commission

**Key Sections:**
- **Section 41**: When police can arrest without warrant
- **Section 41A**: Notice of appearance before arrest in certain cases
- **Section 161**: Police power to examine witnesses

**Important Contacts:**
- **Police Control Room**: 100
- **Women Helpline**: 1091  
- **National Human Rights Commission**: 011-23385368

**Legal Bodies:**
- Magistrate Court for Section 156(3) complaints
- Sessions Court for serious offenses
- High Court for habeas corpus petitions

Immediate action needed: Document everything, get medical examination if injured, contact family/lawyer immediately.`;
  }

  // Consumer protection matters
  if (lowerMessage.includes('consumer') || lowerMessage.includes('defective product') || lowerMessage.includes('unfair trade')) {
    return `🛡️ **Consumer Protection Act, 2019**

**Your Consumer Rights:**
1. **Right to Safety**: Protection against hazardous goods
2. **Right to Information**: Complete product information  
3. **Right to Choose**: Access to competitive market
4. **Right to be Heard**: Voice in consumer policy
5. **Right to Redressal**: Compensation for unfair practices
6. **Right to Education**: Consumer awareness

**Where to Complain:**
- **District Commission**: Claims up to ₹1 crore
- **State Commission**: Claims ₹1 crore to ₹10 crores  
- **National Commission**: Claims above ₹10 crores

**Online Complaint:**
- Visit: edaakhil.nic.in (National Consumer Helpline)
- Call: 1915 (Consumer Helpline)
- SMS: 8130009809

**Documents Required:**
- Purchase receipt/invoice
- Warranty/guarantee card
- Photos of defective product
- Medical reports (if applicable)

**Timeline:**
- District Commission: 3-5 months
- No court fee for claims up to ₹5 lakhs

**Remedies Available:**
- Refund or replacement
- Compensation for damages
- Punitive damages for unfair practices
- Discontinuation of unfair practices

**Key Definitions:**
- **Deficiency**: Fault in service quality/standard
- **Unfair Trade Practice**: Misleading advertisements, false claims
- **Consumer**: Person who buys goods/services for consideration

File complaint within 2 years of cause of action. E-commerce disputes can be filed where consumer resides.`;
  }

  // Property and real estate law
  if (lowerMessage.includes('property') || lowerMessage.includes('real estate') || lowerMessage.includes('registration') || lowerMessage.includes('mutation')) {
    return `🏘️ **Property & Real Estate Law in India**

**Key Laws:**
- **Registration Act, 1908**: Mandatory registration of property documents
- **Transfer of Property Act, 1882**: Rules for property transfer
- **Real Estate (Regulation and Development) Act, 2016 (RERA)**: Protects homebuyers

**Property Registration Process:**
1. **Document Verification**: Check clear title, approvals
2. **Stamp Duty Payment**: Varies by state (3-10% of property value)
3. **Registration**: At Sub-Registrar office within 4 months
4. **Mutation**: Update records in revenue department

**Important Documents:**
- **Sale Deed**: Primary ownership document
- **Title Deed**: Chain of ownership  
- **Encumbrance Certificate**: Property transaction history
- **Possession Certificate**: Actual possession proof

**RERA Protections:**
- **Section 11**: Developer obligations and disclosures
- **Section 18**: Possession timeline penalties
- **Section 19**: Interest on delayed possession
- **Complaint Portal**: rera.gov.in (state-wise)

**Property Disputes:**
- **Civil Court**: Title disputes, partition suits
- **Revenue Court**: Mutation, land records
- **Consumer Forum**: Builder delays, defects (under RERA)
- **DRT**: If loan involved

**Red Flags:**
- Unregistered agreements beyond 11 months
- Properties without clear title
- Unapproved layouts/constructions

**Next Steps:**
1. Verify property documents with lawyer
2. Check RERA registration for new projects  
3. Ensure proper stamp duty payment
4. Complete registration within legal timeline

Always engage qualified property lawyer for due diligence before any property transaction.`;
  }

  // Default comprehensive Indian legal response
  return `🇮🇳 **Indian Legal System - General Guidance**

I'm here to help you with your legal query related to Indian laws. Let me provide you with comprehensive guidance:

**Constitutional Framework:**
- **Fundamental Rights**: Articles 12-35 (Right to Equality, Freedom, etc.)
- **Directive Principles**: Articles 36-51 (State policy guidelines)
- **Fundamental Duties**: Article 51A

**Major Legal Areas:**

**1. Criminal Law:**
- **IPC (Indian Penal Code)**: Defines crimes and punishments
- **CrPC (Criminal Procedure Code)**: Criminal trial procedures
- **Evidence Act**: Rules for evidence in court

**2. Civil Law:**
- **CPC (Civil Procedure Code)**: Civil lawsuit procedures  
- **Contract Act**: Agreement enforceability
- **Tort Law**: Civil wrongs and remedies

**3. Specialized Acts:**
- **RTI Act, 2005**: Right to Information
- **Consumer Protection Act, 2019**: Consumer rights
- **NDPS Act**: Narcotics and drug offenses
- **Prevention of Corruption Act**: Anti-corruption measures

**Legal Remedies Available:**
- **Writ Petitions**: Constitutional remedies (High Court/Supreme Court)
- **Civil Suits**: Monetary compensation, injunctions
- **Criminal Complaints**: Punishment for offenses
- **Tribunal Proceedings**: Specialized dispute resolution

**Important Contacts:**
- **Legal Aid**: 1968
- **National Human Rights Commission**: 011-23385368
- **National Consumer Helpline**: 1915
- **Women Helpline**: 1091

**Immediate Steps:**
1. Identify the specific legal area your issue falls under
2. Gather all relevant documents and evidence
3. Consult with appropriate legal authority or lawyer
4. Know the limitation period for your type of case

Could you please provide more specific details about your legal concern? This will help me give you more targeted guidance based on applicable Indian laws and procedures.

**Disclaimer**: This is general legal information. For specific legal advice tailored to your situation, please consult with a qualified advocate or lawyer registered with the Bar Council of India.`;
}

function categorizeIndianLegalResponse(response: string, question: string): string {
  const content = (response + ' ' + question).toLowerCase();
  
  if (content.includes('rti') || content.includes('right to information')) {
    return 'rti';
  } else if (content.includes('police') || content.includes('fir') || content.includes('criminal') || content.includes('ipc')) {
    return 'criminal';
  } else if (content.includes('consumer') || content.includes('defective') || content.includes('unfair trade')) {
    return 'consumer';
  } else if (content.includes('property') || content.includes('real estate') || content.includes('rera')) {
    return 'property';
  } else if (content.includes('fundamental rights') || content.includes('constitutional') || content.includes('writ')) {
    return 'constitutional';
  } else if (content.includes('family') || content.includes('marriage') || content.includes('divorce')) {
    return 'family';
  } else if (content.includes('labour') || content.includes('employment') || content.includes('workplace')) {
    return 'labour';
  } else if (content.includes('ndps') || content.includes('drug') || content.includes('narcotics')) {
    return 'ndps';
  } else {
    return 'general';
  }
}
