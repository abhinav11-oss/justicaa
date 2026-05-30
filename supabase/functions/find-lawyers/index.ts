import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAPPLS_CLIENT_ID = Deno.env.get('MAPPLS_CLIENT_ID') || '96dHZVzsAuv06cbT2ITWwpAgv1PSonCZuvfd70Ppr2d6RyiSOFLg4b4lUzA1lyvaMOlL58mTjcXMWY0yBRsOAEvuP4AZdMlq';
const MAPPLS_CLIENT_SECRET = Deno.env.get('MAPPLS_CLIENT_SECRET') || 'lrFxI-iSEg9MwpHyhEOg_ZmP0rFVUgnH0wSTnAEJIkOjjYpSiBgJWKlEnSoUVYQvXvwOotKU15Rj_dDeL7XB6aLMAY861Qp-P7sUJgIU7Kw=';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getMapplsToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const tokenUrl = 'https://outpost.mapmyindia.com/api/security/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: MAPPLS_CLIENT_ID,
    client_secret: MAPPLS_CLIENT_SECRET
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to get Mappls token: ${response.status} ${errText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  // Expire 5 minutes before actual expiry (token usually expires in 86400 seconds)
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
  
  return cachedToken;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, city, specialization } = await req.json();

    // Build search query
    let query = "lawyers advocates";
    if (specialization && specialization !== "all") {
      query = `${specialization} lawyers`;
    }

    if (city) {
      query += ` in ${city}`;
    } else if (latitude && longitude) {
      query += ` near me`;
    } else {
      throw new Error("Either city or location coordinates are required");
    }

    console.log("Mappls Text Search:", query);

    const token = await getMapplsToken();
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);
    
    // Add location bias if coordinates are available
    if (latitude && longitude && !city) {
      searchParams.append('location', `${latitude},${longitude}`);
      searchParams.append('radius', '30000'); // 30km radius
    }

    const searchUrl = `https://atlas.mappls.com/api/places/textsearch/json?${searchParams.toString()}`;

    const searchRes = await fetch(searchUrl, {
      headers: {
        'Authorization': `bearer ${token}` // Note: API expects lowercase 'bearer' sometimes, but 'bearer ' works
      }
    });

    if (!searchRes.ok) {
      const errText = await searchRes.text();
      throw new Error(`Mappls Places API error: ${searchRes.status} - ${errText}`);
    }

    const searchData = await searchRes.json();
    const suggestedLocations = searchData.suggestedLocations || [];
    console.log(`Found ${suggestedLocations.length} places`);

    // Map Mappls results to the existing frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lawyers = suggestedLocations.slice(0, 20).map((place: any) => {
      // Calculate distance if user location provided
      let distance: number | undefined;
      if (latitude && longitude && place.latitude && place.longitude) {
        const R = 6371;
        const dLat = (place.latitude - latitude) * Math.PI / 180;
        const dLon = (place.longitude - longitude) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(place.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance = Math.round((R * c) * 10) / 10;
      }

      return {
        id: place.eLoc,
        name: place.placeName,
        address: place.placeAddress || "",
        rating: 0, // Mappls text search typically doesn't return ratings natively in text search
        totalRatings: 0,
        phone: place.phone || "", // Sometimes phone is returned
        website: "",
        latitude: place.latitude || null,
        longitude: place.longitude || null,
        distance,
        isOpen: null, // Hours not typically returned in basic text search
        photos: [], // Photos not typically returned
      };
    });

    // Sort by distance if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lawyers.sort((a: any, b: any) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });

    return new Response(JSON.stringify({ lawyers, total: lawyers.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in find-lawyers:', error);
    return new Response(JSON.stringify({ error: error.message, lawyers: [] }), {
      status: 200, // Returning 200 so the client can read the JSON body
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
