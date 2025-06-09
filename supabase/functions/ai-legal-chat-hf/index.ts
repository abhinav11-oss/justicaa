
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

    // Legal system prompt to guide the AI
    const systemPrompt = `You are a professional Virtual Legal Assistant. Provide helpful legal information and guidance while being clear that you provide general information, not legal advice. Always recommend consulting with a qualified attorney for specific legal matters. Keep responses professional, helpful, and easy to understand.`;

    // Build conversation context
    let conversationText = systemPrompt + "\n\n";
    
    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      if (msg.sender === 'user') {
        conversationText += `Human: ${msg.content}\n\n`;
      } else {
        conversationText += `Assistant: ${msg.content}\n\n`;
      }
    });
    
    // Add current message
    conversationText += `Human: ${message}\n\nAssistant:`;

    console.log('Processing legal query with conversation length:', conversationText.length);

    // Use a free model that doesn't require credits - Google's Flan-T5
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Legal Assistant: ${message}. Please provide helpful legal information while noting this is general information, not specific legal advice.`,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          do_sample: true,
          return_full_text: false
        }
      }),
    });

    let aiResponse;
    
    if (!response.ok) {
      console.error('Hugging Face API error:', response.status);
      // Fallback response for legal questions
      aiResponse = generateFallbackLegalResponse(message);
    } else {
      const data = await response.json();
      console.log('Hugging Face response received successfully');

      if (Array.isArray(data) && data[0]?.generated_text) {
        aiResponse = data[0].generated_text.trim();
      } else if (data.generated_text) {
        aiResponse = data.generated_text.trim();
      } else {
        aiResponse = generateFallbackLegalResponse(message);
      }
    }

    // Clean up the response
    if (aiResponse.includes('Human:')) {
      aiResponse = aiResponse.split('Human:')[0].trim();
    }

    // Ensure the response ends with legal disclaimer
    if (!aiResponse.toLowerCase().includes('legal advice') && !aiResponse.toLowerCase().includes('attorney')) {
      aiResponse += "\n\nPlease note: This is general legal information only. For specific legal advice, please consult with a qualified attorney.";
    }

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
    console.error('Error in ai-legal-chat-hf function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I apologize, but I'm experiencing technical difficulties. For immediate legal assistance, please consider consulting with a qualified attorney in your area."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackLegalResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('contract')) {
    return "Contracts are legally binding agreements between parties. Key elements include offer, acceptance, consideration, and mutual agreement. For contract review or drafting, I recommend consulting with a contract attorney who can ensure your specific needs are met and your rights are protected.";
  } else if (lowerMessage.includes('business') || lowerMessage.includes('llc')) {
    return "Business formation involves choosing the right entity type (LLC, Corporation, Partnership) based on your specific needs. Each has different tax implications, liability protections, and operational requirements. A business attorney can help you choose the best structure and ensure proper compliance with state requirements.";
  } else if (lowerMessage.includes('employment') || lowerMessage.includes('workplace')) {
    return "Employment law covers workplace rights, discrimination, wage and hour laws, and termination procedures. If you're facing workplace issues, document everything and consider consulting with an employment attorney who can advise you on your specific rights and options.";
  } else if (lowerMessage.includes('family') || lowerMessage.includes('divorce')) {
    return "Family law matters including divorce, custody, and support require careful consideration of state-specific laws. These issues can significantly impact your future, so it's important to work with a family law attorney who understands your local court system and can protect your interests.";
  } else if (lowerMessage.includes('real estate') || lowerMessage.includes('property')) {
    return "Real estate transactions involve complex legal documents and potential liabilities. Whether buying, selling, or dealing with property disputes, a real estate attorney can help ensure proper title transfer, contract terms, and compliance with local regulations.";
  } else {
    return "I'm here to provide general legal information and guidance. For your specific legal question, I recommend consulting with a qualified attorney who can provide personalized advice based on your circumstances and local laws. Many attorneys offer initial consultations to discuss your situation.";
  }
}
