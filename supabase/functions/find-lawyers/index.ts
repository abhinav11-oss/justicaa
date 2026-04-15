import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type SearchRequest = {
  city?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  queryTerm?: string;
  maxResultCount?: number;
};

const GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places:searchText";

const buildTextQuery = ({ city, pincode, queryTerm }: SearchRequest) => {
  const baseQuery = queryTerm?.trim() || "lawyer";

  if (pincode) {
    return `${baseQuery} in ${pincode}, India`;
  }

  if (city) {
    return `${baseQuery} in ${city}, India`;
  }

  return `${baseQuery} in India`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const googleMapsApiKey =
      Deno.env.get("GOOGLE_MAPS_API_KEY") ||
      Deno.env.get("GOOGLE_PLACES_API_KEY");

    if (!googleMapsApiKey) {
      throw new Error("GOOGLE_MAPS_API_KEY is not configured");
    }

    const body = (await req.json()) as SearchRequest;
    const textQuery = buildTextQuery(body);

    const payload: Record<string, unknown> = {
      textQuery,
      languageCode: "en",
      regionCode: "IN",
      maxResultCount: body.maxResultCount ?? 10,
    };

    if (body.latitude !== undefined && body.longitude !== undefined) {
      payload.locationBias = {
        circle: {
          center: {
            latitude: body.latitude,
            longitude: body.longitude,
          },
          radius: 15000,
        },
      };
    }

    const response = await fetch(GOOGLE_PLACES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": googleMapsApiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.primaryTypeDisplayName",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Places API error:", errorText);
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data = await response.json();
    const places = Array.isArray(data?.places) ? data.places : [];

    const results = places.map((place: any) => ({
      id: place.id,
      name: place.displayName?.text ?? "Unknown lawyer",
      address: place.formattedAddress ?? "",
      phone: place.nationalPhoneNumber ?? "",
      rating: place.rating ?? 0,
      userRatingCount: place.userRatingCount ?? 0,
      latitude: place.location?.latitude ?? null,
      longitude: place.location?.longitude ?? null,
      googleMapsUri: place.googleMapsUri ?? "",
      primaryType: place.primaryTypeDisplayName?.text ?? "Lawyer",
      source: "google_maps",
    }));

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in find-lawyers function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        results: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
