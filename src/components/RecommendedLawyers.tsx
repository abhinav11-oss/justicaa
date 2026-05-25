import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Phone, Navigation, Sparkles, MapPin, AlertCircle, Loader2, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "@/hooks/useGeolocation";

const aiCategoryToSpecialization: Record<string, string> = {
  'criminal': "Criminal Law",
  'family': "Family Law",
  'consumer': "Consumer Law",
  'property': "Property Law",
  'constitutional': "Civil Law",
  'business': "Business Law",
  'contract': "Contract Law",
  'employment': "Employment Law",
  'labour': "Employment Law",
  'ndps': "Criminal Law",
  'rti': "",
  'general': "",
};

interface LiveLawyer {
  id: string;
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  phone: string;
  website: string;
  latitude: number;
  longitude: number;
  distance?: number;
  isOpen: boolean | null;
}

interface RecommendedLawyersProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  city: string | null;
}

export const RecommendedLawyers = ({ isOpen, onClose, category, city }: RecommendedLawyersProps) => {
  const [recommended, setRecommended] = useState<LiveLawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, getCurrentLocation } = useGeolocation();

  useEffect(() => {
    if (isOpen) {
      fetchRecommendedLawyers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, category, city]);

  const fetchRecommendedLawyers = async () => {
    setLoading(true);
    setError(null);
    try {
      const specialization = aiCategoryToSpecialization[category] || "";

      const { data, error: fnError } = await supabase.functions.invoke('find-lawyers', {
        body: {
          latitude: latitude || null,
          longitude: longitude || null,
          city: city || null,
          specialization: specialization || null,
        }
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      setRecommended((data?.lawyers || []).slice(0, 5));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching recommended lawyers:", err);
      setError(err.message || "Could not fetch lawyer recommendations.");
      setRecommended([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Recommended Lawyers for Your Case
          </DialogTitle>
          <DialogDescription>
            Based on your conversation about <span className="font-semibold capitalize">{category}</span> law, here are real lawyers who may be able to help.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!city && !latitude && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">For better results, set your location in your profile settings or allow location access.</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">Finding lawyers for you...</p>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={fetchRecommendedLawyers}>Try Again</Button>
            </div>
          ) : recommended.length > 0 ? (
            recommended.map(lawyer => (
              <Card key={lawyer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold">{lawyer.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{lawyer.address}</span>
                        </p>
                      </div>
                      {lawyer.rating > 0 && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold">{lawyer.rating}</span>
                          {lawyer.totalRatings > 0 && (
                            <span className="text-xs text-muted-foreground">({lawyer.totalRatings})</span>
                          )}
                        </div>
                      )}
                    </div>
                    {lawyer.distance !== undefined && (
                      <p className="text-sm text-primary font-medium">📍 {lawyer.distance} km away</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="flex-1" onClick={() => {
                        if (lawyer.phone) window.open(`tel:${lawyer.phone}`);
                      }} disabled={!lawyer.phone}>
                        <Phone className="h-4 w-4 mr-1.5" />
                        {lawyer.phone ? "Call" : "No Phone"}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                        const url = latitude && longitude
                          ? `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${lawyer.latitude},${lawyer.longitude}`
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.address)}`;
                        window.open(url, '_blank');
                      }}>
                        <Navigation className="h-4 w-4 mr-1.5" />Directions
                      </Button>
                      {lawyer.website && (
                        <Button size="sm" variant="ghost" onClick={() => window.open(lawyer.website, '_blank')}>
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No lawyers found for this topic and location. You can browse all lawyers in the "Find a Lawyer" section.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};