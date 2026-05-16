import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY') || 'AIzaSyC1Vpu2Jy_TcCshBAEeTxDsxGHCljYNGqw';

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
      query += ` in ${city} India`;
    } else if (latitude && longitude) {
      query += ` near me`;
    } else {
      throw new Error("Either city or location coordinates are required");
    }

    console.log("Google Places Text Search:", query);

    // Step 1: Text Search to find lawyers
    let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`;

    // Add location bias if coordinates are available
    if (latitude && longitude) {
      searchUrl += `&location=${latitude},${longitude}&radius=30000`;
    }

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      throw new Error(`Google Places API error: ${searchRes.status}`);
    }

    const searchData = await searchRes.json();

    if (searchData.status !== "OK" && searchData.status !== "ZERO_RESULTS") {
      console.error("Places API status:", searchData.status, searchData.error_message);
      throw new Error(`Google Places: ${searchData.status} - ${searchData.error_message || 'Unknown error'}`);
    }

    const places = searchData.results || [];
    console.log(`Found ${places.length} places`);

    // Step 2: Get details (phone) for top results
    const lawyers = await Promise.all(
      places.slice(0, 20).map(async (place: any) => {
        let phone = "";
        let website = "";

        // Fetch place details for phone number
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,international_phone_number,website&key=${GOOGLE_PLACES_API_KEY}`;
          const detailsRes = await fetch(detailsUrl);
          const detailsData = await detailsRes.json();
          if (detailsData.result) {
            phone = detailsData.result.international_phone_number || detailsData.result.formatted_phone_number || "";
            website = detailsData.result.website || "";
          }
        } catch (e) {
          console.warn("Could not fetch details for:", place.name);
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
          latitude: place.geometry?.location?.lat || null,
          longitude: place.geometry?.location?.lng || null,
          distance,
          isOpen: place.opening_hours?.open_now ?? null,
          photos: place.photos?.length > 0
            ? [`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`]
            : [],
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
    console.error('Error in find-lawyers:', error);
    return new Response(JSON.stringify({ error: error.message, lawyers: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
