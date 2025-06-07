
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
    const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!HUGGING_FACE_API_KEY) {
      throw new Error('HUGGING_FACE_API_KEY is not set');
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

Areas of expertise include business law, family law, real estate law, employment law, personal injury, intellectual property basics, contract review, and legal document templates.

Always maintain a helpful, professional tone while being clear about the limitations of AI legal assistance.`;

    // Build conversation context for Hugging Face format
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

    console.log('Sending request to Hugging Face with conversation length:', conversationText.length);

    // Updated to use the correct Hugging Face Inference API endpoint
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: conversationText,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
          stop: ["Human:", "\n\nHuman:"]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Hugging Face API error:', errorData);
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Hugging Face response received successfully');

    let aiResponse;
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text.trim();
    } else if (data.generated_text) {
      aiResponse = data.generated_text.trim();
    } else {
      throw new Error('Unexpected response format from Hugging Face');
    }

    // Clean up the response - remove any repeated prompts
    if (aiResponse.includes('Human:')) {
      aiResponse = aiResponse.split('Human:')[0].trim();
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
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or consider consulting with a qualified attorney for immediate legal assistance."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
