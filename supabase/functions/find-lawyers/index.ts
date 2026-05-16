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
    const { latitude, longitude, city, specialization } = await req.json();

    const APIFY_TOKEN = Deno.env.get('APIFY_TOKEN');
    if (!APIFY_TOKEN) {
      throw new Error('APIFY_TOKEN not configured. Please set it in Supabase secrets.');
    }

    // Build search query
    let searchQuery = "lawyers advocates";
    if (specialization && specialization !== "all") {
      searchQuery = `${specialization} lawyers`;
    }

    if (city) {
      searchQuery += ` in ${city} India`;
    } else if (latitude && longitude) {
      searchQuery += ` near me`;
    } else {
      throw new Error("Either city or location coordinates are required");
    }

    console.log("Searching Google Places via Apify for:", searchQuery);

    // Use Apify run-sync-get-dataset-items endpoint
    // This runs the actor synchronously and returns the dataset items directly
    const apiUrl = `https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

    const requestBody: any = {
      searchStringsArray: [searchQuery],
      maxCrawledPlacesPerSearch: 20,
      language: "en",
      deeperCityScrape: false,
    };

    // If we have coordinates, use them for location-based search
    if (latitude && longitude) {
      requestBody.customGeolocation = {
        latitude,
        longitude,
      };
      requestBody.zoom = 13;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Apify API error:", response.status, errorText);
      throw new Error(`Apify API returned ${response.status}`);
    }

    const rawResults = await response.json();
    console.log(`Got ${Array.isArray(rawResults) ? rawResults.length : 0} results from Apify`);

    // Transform raw crawler output into our clean format
    const lawyers = (Array.isArray(rawResults) ? rawResults : []).map((place: any) => {
      // Calculate distance if user coordinates provided
      let distance: number | undefined;
      if (latitude && longitude && place.location?.lat && place.location?.lng) {
        const R = 6371;
        const dLat = (place.location.lat - latitude) * Math.PI / 180;
        const dLon = (place.location.lng - longitude) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(latitude * Math.PI / 180) * Math.cos(place.location.lat * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance = Math.round((R * c) * 10) / 10;
      }

      return {
        id: place.placeId || place.cid || String(Math.random()),
        name: place.title || place.name || "Unknown",
        address: place.address || place.street || "",
        rating: place.totalScore || place.rating || 0,
        totalRatings: place.reviewsCount || 0,
        phone: place.phone || place.phoneUnformatted || "",
        website: place.website || "",
        latitude: place.location?.lat || null,
        longitude: place.location?.lng || null,
        distance,
        isOpen: place.openingHours?.state === "open" ? true :
               place.openingHours?.state === "closed" ? false : null,
        category: place.categoryName || "",
        photos: place.imageUrl ? [place.imageUrl] : [],
      };
    });

    // Sort: distance first, then rating
    lawyers.sort((a: any, b: any) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return (b.rating || 0) - (a.rating || 0);
    });

    return new Response(JSON.stringify({ lawyers, total: lawyers.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in find-lawyers function:', error);
    return new Response(JSON.stringify({ error: error.message, lawyers: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
