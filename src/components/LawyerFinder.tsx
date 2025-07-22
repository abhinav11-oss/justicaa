import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Navigation, Filter, Star, Copy, CheckCircle, AlertCircle, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { lawyersDatabase, Lawyer } from "@/data/lawyers";

interface LawyerFinderProps {
  category?: string;
}

const categoryMap = {
  "All": [],
  "Business Law": ["Business Law", "Corporate Law", "Tax Law", "Contract Law", "Intellectual Property"],
  "Personal Legal": ["Family Law", "Personal Legal", "Consumer Law", "Employment Law", "Criminal Law", "Civil Law"],
  "Contract Review": ["Contract Law", "Business Law", "Employment Law", "Civil Law"]
};

const cityCoordinates = {
  "Gwalior": { lat: 26.2183, lng: 78.1828 },
  "Delhi": { lat: 28.6139, lng: 77.2090 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Jhansi": { lat: 25.4484, lng: 78.5685 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Ujjain": { lat: 23.1765, lng: 75.7885 }
};

const pincodeToCity: { [key: string]: string } = {
  "474001": "Gwalior", "474006": "Gwalior", "474011": "Gwalior",
  "110001": "Delhi", "110005": "Delhi", "110024": "Delhi",
  "400050": "Mumbai", "400058": "Mumbai", "400076": "Mumbai",
  "560034": "Bangalore", "560011": "Bangalore", "560100": "Bangalore",
  "284001": "Jhansi", "284003": "Jhansi",
  "462011": "Bhopal", "462016": "Bhopal",
  "452010": "Indore", "452001": "Indore",
  "456010": "Ujjain", "456006": "Ujjain"
};

export const LawyerFinder = ({ category }: LawyerFinderProps) => {
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryMap>("All");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [userCity, setUserCity] = useState<string>("");
  const [manualLocation, setManualLocation] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'city' | 'location' | null>(null);
  const { toast } = useToast();
  const { latitude, longitude, error, loading, getCurrentLocation, setManualLocation: setGeoLocation } = useGeolocation();

  const specializations = [
    "Criminal Law", "Family Law", "Property Law", "Civil Law", "Business Law", "Contract Law",
    "Consumer Law", "Employment Law", "Cyber Law", "Personal Legal", "Intellectual Property",
    "Corporate Law", "Tax Law"
  ];

  const cities = ["Gwalior", "Delhi", "Mumbai", "Bangalore", "Jhansi", "Bhopal", "Indore", "Ujjain"];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round((R * c) * 10) / 10;
  };

  useEffect(() => {
    let tempLawyers = [...lawyersDatabase];

    // 1. Location Filtering
    if (searchMode === 'location' && latitude && longitude) {
      tempLawyers.forEach(lawyer => {
        lawyer.distance = calculateDistance(latitude, longitude, lawyer.latitude, lawyer.longitude);
      });
      tempLawyers = tempLawyers.filter(l => l.distance !== undefined && l.distance <= 50);
    } else if (searchMode === 'city' && userCity) {
      tempLawyers = tempLawyers.filter(l => l.city === userCity);
    }

    // 2. Category Filtering
    if (selectedCategory !== "All") {
      const relevantSpecs = categoryMap[selectedCategory] || [];
      if (relevantSpecs.length > 0) {
        tempLawyers = tempLawyers.filter(lawyer => 
          lawyer.specialization.some(spec => relevantSpecs.includes(spec))
        );
      }
    }

    // 3. Specialization Filtering
    if (selectedSpecialization !== "all") {
      tempLawyers = tempLawyers.filter(lawyer => 
        lawyer.specialization.includes(selectedSpecialization)
      );
    }

    // 4. Sorting
    tempLawyers.sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return b.rating - a.rating;
    });

    setFilteredLawyers(tempLawyers);
  }, [latitude, longitude, userCity, selectedCategory, selectedSpecialization, searchMode]);

  useEffect(() => {
    if (category && categoryMap[category as keyof typeof categoryMap]) {
      setSelectedCategory(category as keyof typeof categoryMap);
    }
  }, [category]);

  const handleUseCurrentLocation = () => {
    setUserCity("");
    setSearchMode('location');
    getCurrentLocation();
    toast({ title: "Getting your location..." });
  };

  const handleCitySelect = (city: string) => {
    if (cityCoordinates[city as keyof typeof cityCoordinates]) {
      const coords = cityCoordinates[city as keyof typeof cityCoordinates];
      setGeoLocation(coords.lat, coords.lng);
      setUserCity(city);
      setSearchMode('city');
      toast({ title: `Showing lawyers in ${city}` });
    }
  };

  const handleLocationSubmit = () => {
    const input = manualLocation.trim();
    if (!input) {
      toast({ title: "Location Required", variant: "destructive" });
      return;
    }

    const pincodeMatch = input.match(/^\d{6}$/);
    if (pincodeMatch) {
      const city = pincodeToCity[input];
      if (city) {
        handleCitySelect(city);
        return;
      }
    }

    const matchedCity = cities.find(c => c.toLowerCase() === input.toLowerCase());
    if (matchedCity) {
      handleCitySelect(matchedCity);
    } else {
      toast({ title: "Location Not Found", description: "Please enter a valid city or 6-digit pincode.", variant: "destructive" });
    }
  };

  const handleCall = (phone: string, lawyerName: string) => {
    if (!phone) {
      setShowPhoneModal(`Number not available for ${lawyerName}`);
      return;
    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phone}`;
    } else {
      setShowPhoneModal(phone);
    }
  };

  const handleDirections = (lawyer: Lawyer) => {
    const destinationQuery = encodeURIComponent(lawyer.address);
    
    if (latitude && longitude) {
        const origin = `${latitude},${longitude}`;
        const destination = `${lawyer.latitude},${lawyer.longitude}`;
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
        window.open(directionsUrl, '_blank');
    } else {
        const searchUrl = `https://www.google.com/maps/search/?api=1&query=${destinationQuery}`;
        window.open(searchUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><MapPin className="h-5 w-5 mr-2" />Find Lawyers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select onValueChange={handleCitySelect}>
              <SelectTrigger><SelectValue placeholder="Select a city" /></SelectTrigger>
              <SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={handleUseCurrentLocation} disabled={loading} variant="outline">
              {loading ? "Getting Location..." : "Use Current Location"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Or enter city/pincode"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocationSubmit()}
            />
            <Button onClick={handleLocationSubmit}>Search</Button>
          </div>
          {error && <div className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-2" />{error}</div>}
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as keyof typeof categoryMap)}>
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
              <SelectTrigger className="w-48"><SelectValue placeholder="Filter by specialization" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                {specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{filteredLawyers.length} Lawyers Found</h3>
            {filteredLawyers.length === 0 && searchMode ? (
              <Card><CardContent className="text-center py-8"><p>No lawyers found. Try a different location or filter.</p></CardContent></Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                {filteredLawyers.map((lawyer) => (
                  <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">{lawyer.name}</h4>
                          <p className="text-muted-foreground text-sm">{lawyer.location}, {lawyer.city}</p>
                        </div>
                        <div className="flex items-center space-x-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{lawyer.rating}</span></div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lawyer.specialization.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Experience: {lawyer.experience} years</p>
                        {lawyer.distance && <p className="text-primary font-medium">{lawyer.distance} km away</p>}
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" onClick={() => handleCall(lawyer.phone, lawyer.name)} className="flex-1"><Phone className="h-4 w-4 mr-2" />Call</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDirections(lawyer)} className="flex-1"><Navigation className="h-4 w-4 mr-2" />Directions</Button>
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
          <DialogHeader><DialogTitle>Contact Number</DialogTitle></DialogHeader>
          <DialogDescription>{showPhoneModal}</DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};