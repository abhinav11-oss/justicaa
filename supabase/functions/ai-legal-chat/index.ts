
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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message, conversationHistory = [] } = await req.json();

    // Legal system prompt to guide the AI
    const systemPrompt = `You are a professional Virtual Legal Assistant with expertise in various areas of law. Your role is to:

1. Provide accurate, helpful legal information and guidance
2. Help users understand legal processes and requirements
3. Offer practical advice for common legal situations
4. Guide users through document preparation and legal procedures
5. Identify when professional legal counsel is needed

Important guidelines:
- Always clarify that you provide general legal information, not legal advice
- Recommend consulting with a qualified attorney for specific legal matters
- Be helpful, professional, and easy to understand
- Avoid giving specific legal advice or representing clients
- Focus on education and guidance rather than definitive legal opinions
- Be aware of different state and federal laws when relevant

Areas of expertise include:
- Business law (formation, contracts, compliance)
- Family law (divorce, custody, estate planning)
- Real estate law (transactions, landlord-tenant issues)
- Employment law (contracts, rights, discrimination)
- Personal injury and liability
- Intellectual property basics
- Contract review and preparation
- Legal document templates and forms

Always maintain a helpful, professional tone while being clear about the limitations of AI legal assistance.`;

    // Build conversation context
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: "user", content: message }
    ];

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');

    const aiResponse = data.choices[0].message.content;

    // Categorize the response based on content
    let category = 'general';
    const content = aiResponse.toLowerCase();
    
    if (content.includes('business') || content.includes('llc') || content.includes('corporation')) {
      category = 'business';
    } else if (content.includes('contract') || content.includes('agreement')) {
      category = 'contract';
    } else if (content.includes('family') || content.includes('divorce') || content.includes('custody')) {
      category = 'family';
    } else if (content.includes('real estate') || content.includes('property') || content.includes('landlord')) {
      category = 'real-estate';
    } else if (content.includes('employment') || content.includes('workplace')) {
      category = 'employment';
    } else if (content.includes('intellectual property') || content.includes('trademark') || content.includes('copyright')) {
      category = 'intellectual-property';
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      category: category 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-legal-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or consider consulting with a qualified attorney for immediate legal assistance."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
