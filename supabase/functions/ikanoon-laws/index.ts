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

    // The iKanoon API seems to use the token directly in the URL
    const apiUrl = `https://api.indiankanoon.org/search/?formInput=${encodeURIComponent(query)}&token=${IKANOON_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST', // As per some documentation, it might be a POST request
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('iKanoon API error:', errorText);
      throw new Error(`iKanoon API error: ${response.status} - ${errorText}`);
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