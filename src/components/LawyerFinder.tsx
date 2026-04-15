import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Navigation, Filter, Star, AlertCircle, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { supabase } from "@/integrations/supabase/client";

interface LawyerFinderProps {
  category?: string;
}

interface GoogleLawyerResult {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  userRatingCount: number;
  latitude: number | null;
  longitude: number | null;
  googleMapsUri: string;
  primaryType: string;
  source: "google_maps";
}

type SearchMode = "city" | "pincode" | "nearby" | null;
type SearchTarget = { mode: Exclude<SearchMode, null>; value?: string };

const categoryQueryMap = {
  All: "lawyer",
  "Business Law": "business lawyer",
  "Personal Legal": "family lawyer",
  "Contract Review": "contract lawyer",
};

const commonCities = ["Delhi", "Mumbai", "Bangalore", "Jhansi", "Bhopal", "Indore", "Ujjain", "Gwalior"];

export const LawyerFinder = ({ category }: LawyerFinderProps) => {
  const [results, setResults] = useState<GoogleLawyerResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryQueryMap>("All");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearch, setLastSearch] = useState<SearchTarget | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState<string | null>(null);
  const { toast } = useToast();
  const { latitude, longitude, error, loading, getCurrentLocation } = useGeolocation();

  const specializations = [
    "Criminal Law",
    "Family Law",
    "Property Law",
    "Civil Law",
    "Business Law",
    "Contract Law",
    "Consumer Law",
    "Employment Law",
    "Cyber Law",
    "Intellectual Property",
    "Corporate Law",
    "Tax Law",
  ];

  useEffect(() => {
    if (category && category in categoryQueryMap) {
      setSelectedCategory(category as keyof typeof categoryQueryMap);
    }
  }, [category]);

  const queryTerm = useMemo(() => {
    if (selectedSpecialization !== "all") {
      return selectedSpecialization.toLowerCase();
    }

    return categoryQueryMap[selectedCategory];
  }, [selectedCategory, selectedSpecialization]);

  const runSearch = useCallback(
    async (target: SearchTarget) => {
      setIsSearching(true);
      setSearchError(null);
      setSearchMode(target.mode);
      setLastSearch(target);

      try {
        const body: Record<string, unknown> = {
          queryTerm,
          maxResultCount: 10,
        };

        if (target.mode === "city" && target.value) {
          body.city = target.value;
        }

        if (target.mode === "pincode" && target.value) {
          body.pincode = target.value;
        }

        if (target.mode === "nearby") {
          if (latitude === null || longitude === null) {
            throw new Error("Current location is not available yet.");
          }
          body.latitude = latitude;
          body.longitude = longitude;
        }

        const { data, error: invokeError } = await supabase.functions.invoke("find-lawyers", { body });

        if (invokeError) {
          throw invokeError;
        }

        const nextResults = Array.isArray(data?.results) ? data.results : [];
        setResults(nextResults);

        if (nextResults.length === 0) {
          toast({
            title: "No lawyers found",
            description: "Google Maps did not return lawyer listings for this search.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Lawyer search updated",
            description: `Found ${nextResults.length} Google Maps results.`,
          });
        }
      } catch (searchFailure: any) {
        console.error("Error searching lawyers:", searchFailure);
        setResults([]);
        const message = searchFailure?.message || "Could not fetch real lawyer listings from Google Maps.";
        setSearchError(message);
        toast({
          title: "Search failed",
          description: message,
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    },
    [latitude, longitude, queryTerm, toast],
  );

  useEffect(() => {
    if (lastSearch) {
      void runSearch(lastSearch);
    }
  }, [queryTerm, runSearch, lastSearch]);

  useEffect(() => {
    if (searchMode === "nearby" && lastSearch?.mode === "nearby" && latitude !== null && longitude !== null) {
      void runSearch({ mode: "nearby" });
    }
  }, [latitude, longitude, lastSearch, runSearch, searchMode]);

  const handleCitySearch = (city: string) => {
    const value = city.trim();
    if (!value) {
      toast({ title: "City required", variant: "destructive" });
      return;
    }

    setSelectedCity(value);
    setCityInput(value);
    void runSearch({ mode: "city", value });
  };

  const handlePincodeSearch = () => {
    const value = pincodeInput.trim();
    if (!/^\d{6}$/.test(value)) {
      toast({
        title: "Invalid pin code",
        description: "Enter a valid 6-digit Indian pin code.",
        variant: "destructive",
      });
      return;
    }

    void runSearch({ mode: "pincode", value });
  };

  const handleUseCurrentLocation = () => {
    setSearchMode("nearby");
    setLastSearch({ mode: "nearby" });
    getCurrentLocation();
    toast({ title: "Getting your location..." });
  };

  const handleCall = (phone: string, lawyerName: string) => {
    if (!phone) {
      setShowPhoneModal(`Phone number is not listed on Google Maps for ${lawyerName}.`);
      return;
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phone}`;
      return;
    }

    setShowPhoneModal(phone);
  };

  const handleDirections = (lawyer: GoogleLawyerResult) => {
    if (lawyer.latitude !== null && lawyer.longitude !== null) {
      const destination = `${lawyer.latitude},${lawyer.longitude}`;
      const directionsUrl =
        latitude !== null && longitude !== null
          ? `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destination}&travelmode=driving`
          : `https://www.google.com/maps/search/?api=1&query=${destination}`;
      window.open(directionsUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (lawyer.googleMapsUri) {
      window.open(lawyer.googleMapsUri, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Find Lawyers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedCity || undefined} onValueChange={handleCitySearch}>
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {commonCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder="Enter city name"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCitySearch(cityInput)}
              />
              <Button onClick={() => handleCitySearch(cityInput)}>Search City</Button>
            </div>

            <Button onClick={handleUseCurrentLocation} disabled={loading || isSearching} variant="outline">
              {loading ? "Getting Location..." : "Use Current Location"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter 6-digit pin code"
              value={pincodeInput}
              onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && handlePincodeSearch()}
            />
            <Button onClick={handlePincodeSearch}>Search Pin Code</Button>
          </div>

          {(error || searchError) && (
            <div className="text-sm text-destructive flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {searchError || error}
            </div>
          )}

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Results are fetched live from Google Maps when the backend key is configured.
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as keyof typeof categoryQueryMap)}>
        <div className="w-full overflow-x-auto horizontal-scrollbar pb-2">
          <TabsList className="grid w-full grid-cols-4 min-w-[500px]">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Business Law">Business</TabsTrigger>
            <TabsTrigger value="Personal Legal">Personal</TabsTrigger>
            <TabsTrigger value="Contract Review">Contracts</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={selectedCategory} className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="text-lg font-semibold">{results.length} Lawyers Found</h3>
            {results.length === 0 && searchMode ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p>No Google Maps lawyers found for the selected city, pin code, or current location.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                {results.map((lawyer) => (
                  <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h4 className="font-semibold text-lg">{lawyer.name}</h4>
                          <p className="text-muted-foreground text-sm">{lawyer.address}</p>
                        </div>
                        <div className="flex items-center space-x-1 shrink-0">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{lawyer.rating ? lawyer.rating.toFixed(1) : "N/A"}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{lawyer.primaryType || "Lawyer"}</Badge>
                        {lawyer.userRatingCount > 0 && (
                          <Badge variant="secondary">{lawyer.userRatingCount} ratings</Badge>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" onClick={() => handleCall(lawyer.phone, lawyer.name)} className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDirections(lawyer)} className="flex-1">
                          <Navigation className="h-4 w-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!showPhoneModal} onOpenChange={() => setShowPhoneModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Number</DialogTitle>
          </DialogHeader>
          <DialogDescription>{showPhoneModal}</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};
