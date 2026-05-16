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

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured. Please set GOOGLE_PLACES_API_KEY in Supabase secrets.');
    }

    // Build the search query
    let query = "lawyers advocates near";
    if (specialization && specialization !== "all") {
      query = `${specialization} lawyers advocates near`;
    }

    let locationParam = "";
    if (latitude && longitude) {
      locationParam = `&location=${latitude},${longitude}&radius=30000`;
      query += ` me`;
    } else if (city) {
      query += ` ${city} India`;
    } else {
      throw new Error("Either latitude/longitude or city is required");
    }

    // Use Google Places Text Search API
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}${locationParam}&type=lawyer&key=${apiKey}`;

    console.log("Searching for lawyers:", query);

    const placesResponse = await fetch(searchUrl);
    if (!placesResponse.ok) {
      throw new Error(`Google Places API error: ${placesResponse.status}`);
    }

    const placesData = await placesResponse.json();

    if (placesData.status !== "OK" && placesData.status !== "ZERO_RESULTS") {
      console.error("Places API status:", placesData.status, placesData.error_message);
      throw new Error(`Google Places API returned: ${placesData.status}`);
    }

    const results = placesData.results || [];

    // For each result, get details (phone number)
    const lawyers = await Promise.all(
      results.slice(0, 20).map(async (place: any, index: number) => {
        let phone = "";
        let website = "";

        // Get place details for phone number
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,international_phone_number,website,opening_hours&key=${apiKey}`;
          const detailsRes = await fetch(detailsUrl);
          const detailsData = await detailsRes.json();
          if (detailsData.result) {
            phone = detailsData.result.international_phone_number || detailsData.result.formatted_phone_number || "";
            website = detailsData.result.website || "";
          }
        } catch (e) {
          console.warn("Could not fetch details for place:", place.name);
        }

        // Calculate distance if user location provided
        let distance: number | undefined;
        if (latitude && longitude && place.geometry?.location) {
          const R = 6371;
          const dLat = (place.geometry.location.lat - latitude) * Math.PI / 180;
          const dLon = (place.geometry.location.lng - longitude) * Math.PI / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude * Math.PI / 180) * Math.cos(place.geometry.location.lat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          distance = Math.round((R * c) * 10) / 10;
        }

        return {
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || "",
          rating: place.rating || 0,
          totalRatings: place.user_ratings_total || 0,
          phone,
          website,
          latitude: place.geometry?.location?.lat,
          longitude: place.geometry?.location?.lng,
          distance,
          isOpen: place.opening_hours?.open_now ?? null,
          photos: place.photos?.slice(0, 1).map((p: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${apiKey}`
          ) || [],
        };
      })
    );

    // Sort by distance if available, else by rating
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
