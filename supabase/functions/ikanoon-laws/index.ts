import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const IKANOON_API_KEY = Deno.env.get('IKANOON_API_KEY');

    if (!IKANOON_API_KEY) {
      throw new Error('IKANOON_API_KEY is not set in Supabase secrets.');
    }
    if (!query) {
      throw new Error('Search query is required.');
    }

    const apiUrl = 'https://api.indiankanoon.org/search/';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${IKANOON_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formInput: query,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('iKanoon API error:', errorText);
      let errorMessage = `iKanoon API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.detail) {
          errorMessage += ` - ${errorJson.detail}`;
        } else {
          errorMessage += ` - ${errorText}`;
        }
      } catch (e) {
        errorMessage += ` - ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ikanoon-laws function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});