import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Navigation, Star, AlertCircle, Loader2, LocateFixed, Globe, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";

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
  photos: string[];
}

interface LawyerFinderProps {
  category?: string;
}

const specializations = [
  "Criminal Law", "Family Law", "Property Law", "Civil Law", "Business Law", "Contract Law",
  "Consumer Law", "Employment Law", "Cyber Law", "Corporate Law", "Tax Law", "Divorce Law",
];

export const LawyerFinder = ({ category }: LawyerFinderProps) => {
  const [lawyers, setLawyers] = useState<LiveLawyer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [cityInput, setCityInput] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState<string | null>(null);
  const [searchedLocation, setSearchedLocation] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const { latitude, longitude, error: geoError, loading: geoLoading, getCurrentLocation } = useGeolocation();

  const fetchLawyers = async (params: { latitude?: number; longitude?: number; city?: string; specialization?: string }) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('find-lawyers', {
        body: {
          latitude: params.latitude || null,
          longitude: params.longitude || null,
          city: params.city || null,
          specialization: params.specialization && params.specialization !== "all" ? params.specialization : null,
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setLawyers(data?.lawyers || []);

      if (data?.lawyers?.length > 0) {
        toast({ title: `Found ${data.lawyers.length} lawyers nearby` });
      } else {
        toast({ title: "No lawyers found", description: "Try a different location or broaden your search.", variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Error fetching lawyers:", error);
      toast({
        title: "Error finding lawyers",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setLawyers([]);
    } finally {
      setIsSearching(false);
    }
  };

  // When GPS location is obtained, auto-search
  useEffect(() => {
    if (latitude && longitude && !geoLoading && !isSearching) {
      setSearchedLocation("your current location");
      fetchLawyers({ latitude, longitude, specialization: selectedSpecialization });
    }
  }, [latitude, longitude, geoLoading]);

  const handleUseCurrentLocation = () => {
    setCityInput("");
    setSearchedLocation(null);
    getCurrentLocation();
    toast({ title: "📍 Getting your location...", description: "Please allow location access in your browser." });
  };

  const handleCitySearch = () => {
    const city = cityInput.trim();
    if (!city) {
      toast({ title: "Please enter a city name", variant: "destructive" });
      return;
    }
    setSearchedLocation(city);
    fetchLawyers({ city, specialization: selectedSpecialization });
  };

  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value);
    // Re-search with new specialization if we already have a location
    if (latitude && longitude) {
      fetchLawyers({ latitude, longitude, specialization: value });
    } else if (searchedLocation && searchedLocation !== "your current location") {
      fetchLawyers({ city: searchedLocation, specialization: value });
    }
  };

  const handleCall = (phone: string, lawyerName: string) => {
    if (!phone) {
      toast({ title: "Phone number not available", description: `No contact number listed for ${lawyerName}`, variant: "destructive" });
      return;
    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phone}`;
    } else {
      setShowPhoneModal(phone);
    }
  };

  const handleDirections = (lawyer: LiveLawyer) => {
    let url: string;
    if (latitude && longitude) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${lawyer.latitude},${lawyer.longitude}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.address)}`;
    }
    window.open(url, '_blank');
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.3;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalf
                ? "fill-yellow-400/50 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
        <span className="text-sm font-medium ml-1">{rating}</span>
        </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Find Lawyers Near You
          </CardTitle>
          <p className="text-sm text-muted-foreground">Search for real lawyers and advocates in your area using Google Maps data.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your city (e.g. Gwalior, Delhi)..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
              />
              <Button onClick={handleCitySearch} disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </div>
            <Button onClick={handleUseCurrentLocation} disabled={geoLoading || isSearching} variant="outline" className="gap-2">
              {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
              {geoLoading ? "Detecting Location..." : "Use My Current Location"}
            </Button>
          </div>

          {/* Specialization filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Filter by:</span>
            <Select value={selectedSpecialization} onValueChange={handleSpecializationChange}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="All Specializations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lawyers & Advocates</SelectItem>
                {specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {geoError && (
            <div className="text-sm text-destructive flex items-center gap-2 bg-destructive/10 rounded-md px-3 py-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{geoError}</span>
            </div>
          )}

          {searchedLocation && !isSearching && (
            <div className="text-sm text-primary flex items-center gap-2 bg-primary/10 rounded-md px-3 py-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>Showing results near <strong>{searchedLocation}</strong></span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {isSearching ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Finding lawyers near you...</p>
          </CardContent>
        </Card>
      ) : hasSearched && lawyers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 space-y-3">
            <MapPin className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground">No lawyers found for this location.</p>
            <p className="text-sm text-muted-foreground">Try searching a different city or use your current location.</p>
          </CardContent>
        </Card>
      ) : lawyers.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">{lawyers.length} Lawyers Found</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {lawyers.map((lawyer) => (
              <Card key={lawyer.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-base truncate">{lawyer.name}</h4>
                      <p className="text-muted-foreground text-sm flex items-start gap-1 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{lawyer.address}</span>
                      </p>
                    </div>
                    {lawyer.isOpen !== null && (
                      <Badge variant={lawyer.isOpen ? "default" : "secondary"} className="flex-shrink-0 text-xs">
                        {lawyer.isOpen ? "Open" : "Closed"}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {lawyer.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        {renderStars(lawyer.rating)}
                        {lawyer.totalRatings > 0 && (
                          <span className="text-xs text-muted-foreground ml-1">({lawyer.totalRatings})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No ratings yet</span>
                    )}
                    {lawyer.distance !== undefined && (
                      <span className="text-sm text-primary font-medium">📍 {lawyer.distance} km</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button size="sm" onClick={() => handleCall(lawyer.phone, lawyer.name)} className="flex-1" disabled={!lawyer.phone}>
                      <Phone className="h-4 w-4 mr-1.5" />
                      {lawyer.phone ? "Call" : "No Phone"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDirections(lawyer)} className="flex-1">
                      <Navigation className="h-4 w-4 mr-1.5" />
                      Directions
                    </Button>
                    {lawyer.website && (
                      <Button size="sm" variant="ghost" onClick={() => window.open(lawyer.website, '_blank')} className="px-3">
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : !hasSearched ? (
        <Card>
          <CardContent className="text-center py-12 space-y-4">
            <LocateFixed className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <div>
              <p className="text-lg font-medium">Search for lawyers near you</p>
              <p className="text-sm text-muted-foreground mt-1">Enter a city or use your current location to find lawyers and advocates in your area.</p>
            </div>
            <Button onClick={handleUseCurrentLocation} variant="outline" className="gap-2">
              <LocateFixed className="h-4 w-4" />
              Detect My Location
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Phone Modal */}
      <Dialog open={!!showPhoneModal} onOpenChange={() => setShowPhoneModal(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Contact Number</DialogTitle></DialogHeader>
          <DialogDescription className="text-lg font-mono text-center py-4">{showPhoneModal}</DialogDescription>
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(showPhoneModal || "");
                toast({ title: "Phone number copied!" });
              }}
            >
              Copy Number
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};