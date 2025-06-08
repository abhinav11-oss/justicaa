
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Navigation, Filter, Star, Copy, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";

interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  location: string;
  city: string;
  pincode: string;
  phone: string;
  experience: number;
  rating: number;
  address: string;
  verified: boolean;
  latitude: number;
  longitude: number;
  distance?: number;
}

interface LawyerFinderProps {
  category?: string;
}

// Enhanced lawyer data focused on Gwalior and nearby areas
const lawyersDatabase: Lawyer[] = [
  // Gwalior Lawyers
  {
    id: "1",
    name: "Adv. Rajesh Kumar Sharma",
    specialization: ["Criminal Law", "Family Law", "Consumer Law"],
    location: "Lashkar",
    city: "Gwalior",
    pincode: "474001",
    phone: "+91-98765-43210",
    experience: 15,
    rating: 4.5,
    address: "Shop No. 15, Sarafa Bazaar, Lashkar, Gwalior - 474001",
    verified: true,
    latitude: 26.2124,
    longitude: 78.1772
  },
  {
    id: "2", 
    name: "Adv. Priya Agarwal",
    specialization: ["Property Law", "Civil Law", "Business Law"],
    location: "City Centre",
    city: "Gwalior",
    pincode: "474011",
    phone: "+91-98765-43211",
    experience: 12,
    rating: 4.7,
    address: "201, City Centre Mall, Gwalior - 474011",
    verified: true,
    latitude: 26.2295,
    longitude: 78.1807
  },
  {
    id: "3",
    name: "Adv. Suresh Gupta",
    specialization: ["Business Law", "Contract Law", "Intellectual Property"],
    location: "Thatipur", 
    city: "Gwalior",
    pincode: "474011",
    phone: "+91-98765-43212",
    experience: 20,
    rating: 4.3,
    address: "Advocate Chamber, District Court Complex, Thatipur, Gwalior - 474011",
    verified: true,
    latitude: 26.2083,
    longitude: 78.1896
  },
  {
    id: "4",
    name: "Adv. Meera Joshi",
    specialization: ["Consumer Law", "Employment Law", "Family Law"],
    location: "Morar",
    city: "Gwalior",
    pincode: "474006",
    phone: "+91-98765-43213", 
    experience: 8,
    rating: 4.6,
    address: "Near Railway Station, Morar, Gwalior - 474006",
    verified: false,
    latitude: 26.2389,
    longitude: 78.2378
  },
  {
    id: "5",
    name: "Adv. Amit Verma",
    specialization: ["Criminal Law", "Cyber Law"],
    location: "Maharaj Bada",
    city: "Gwalior",
    pincode: "474002",
    phone: "+91-98765-43214",
    experience: 10,
    rating: 4.4,
    address: "Chamber No. 12, Lawyer's Colony, Maharaj Bada, Gwalior - 474002",
    verified: true,
    latitude: 26.2230,
    longitude: 78.1867
  },
  {
    id: "6",
    name: "Adv. Kavita Singh",
    specialization: ["Family Law", "Personal Legal"],
    location: "Hazira",
    city: "Gwalior",
    pincode: "474001",
    phone: "+91-98765-43215",
    experience: 18,
    rating: 4.8,
    address: "Near Gwalior Fort, Hazira, Gwalior - 474001",
    verified: true,
    latitude: 26.2295,
    longitude: 78.1674
  },
  
  // Nearby cities for comparison
  {
    id: "7",
    name: "Adv. Ravi Patel",
    specialization: ["Business Law", "Corporate Law", "Tax Law"],
    location: "Civil Lines",
    city: "Jhansi",
    pincode: "284001",
    phone: "+91-98765-43216",
    experience: 14,
    rating: 4.5,
    address: "Civil Lines, Jhansi - 284001",
    verified: true,
    latitude: 25.4484,
    longitude: 78.5685
  },
  {
    id: "8",
    name: "Adv. Sunita Agarwal",
    specialization: ["Contract Law", "Employment Law", "Civil Law"],
    location: "Scindia Nagar",
    city: "Bhopal",
    pincode: "462016",
    phone: "+91-98765-43217",
    experience: 11,
    rating: 4.6,
    address: "Scindia Nagar, Bhopal - 462016",
    verified: true,
    latitude: 23.2599,
    longitude: 77.4126
  }
];

const categoryMap = {
  "Business Law": ["Business Law", "Corporate Law", "Tax Law", "Contract Law", "Intellectual Property"],
  "Personal Legal": ["Family Law", "Personal Legal", "Consumer Law", "Employment Law"],
  "Contract Review": ["Contract Law", "Business Law", "Employment Law", "Civil Law"]
};

// Gwalior coordinates as default
const GWALIOR_COORDS = { lat: 26.2183, lng: 78.1828 };

export const LawyerFinder = ({ category }: LawyerFinderProps) => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryMap>("Business Law");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("Gwalior");
  const [manualLocation, setManualLocation] = useState("");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState<string | null>(null);
  const { toast } = useToast();
  const { latitude, longitude, error, loading, getCurrentLocation, setManualLocation: setGeoLocation } = useGeolocation();

  const specializations = [
    "Criminal Law", "Family Law", "Property Law", "Civil Law", "Business Law", "Contract Law",
    "Consumer Law", "Employment Law", "Cyber Law", "Personal Legal", "Intellectual Property",
    "Corporate Law", "Tax Law"
  ];

  const cities = ["Gwalior", "Jhansi", "Bhopal", "Indore", "Ujjain", "Morena", "Bhind", "Datia"];

  useEffect(() => {
    // Set Gwalior as default location
    setGeoLocation(GWALIOR_COORDS.lat, GWALIOR_COORDS.lng);
    setLawyers(lawyersDatabase);
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      // Calculate distances and sort by proximity
      const lawyersWithDistance = lawyersDatabase.map(lawyer => ({
        ...lawyer,
        distance: calculateDistance(latitude, longitude, lawyer.latitude, lawyer.longitude)
      })).sort((a, b) => a.distance - b.distance);
      
      setLawyers(lawyersWithDistance);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    filterLawyers();
  }, [selectedSpecialization, selectedCategory, selectedCity, lawyers]);

  useEffect(() => {
    if (category && categoryMap[category as keyof typeof categoryMap]) {
      setSelectedCategory(category as keyof typeof categoryMap);
    }
  }, [category]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filterLawyers = () => {
    let filtered = lawyers;

    // Filter by city first (prioritize local lawyers)
    if (selectedCity !== "all") {
      filtered = filtered.filter(lawyer => lawyer.city === selectedCity);
    }

    // Filter by category
    const relevantSpecs = categoryMap[selectedCategory] || [];
    if (relevantSpecs.length > 0) {
      filtered = filtered.filter(lawyer => 
        lawyer.specialization.some(spec => relevantSpecs.includes(spec))
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(lawyer => 
        lawyer.specialization.includes(selectedSpecialization)
      );
    }

    setFilteredLawyers(filtered);
  };

  const handleLocationSubmit = () => {
    if (!manualLocation.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a city or pincode",
        variant: "destructive"
      });
      return;
    }
    
    // Check if it's Gwalior or nearby
    const isGwalior = manualLocation.toLowerCase().includes('gwalior') || 
                     manualLocation.includes('474');
    
    if (isGwalior) {
      setGeoLocation(GWALIOR_COORDS.lat, GWALIOR_COORDS.lng);
      setSelectedCity("Gwalior");
    } else {
      // Set generic coordinates for other locations
      setGeoLocation(26.2183, 78.1828);
    }
    
    toast({
      title: "Location Set",
      description: `Location set to ${manualLocation}`,
    });
  };

  const handleCall = (phone: string, lawyerName: string) => {
    if (!phone) {
      setShowPhoneModal(`Number not available for ${lawyerName}`);
      return;
    }

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `tel:${phone}`;
    } else {
      // Show modal with number for desktop users
      setShowPhoneModal(phone);
    }
  };

  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
      toast({
        title: "Phone Number Copied",
        description: `${phone} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy phone number",
        variant: "destructive"
      });
    }
  };

  const handleDirections = (lawyer: Lawyer) => {
    if (latitude && longitude && lawyer.address) {
      // Use accurate coordinates for directions
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(lawyer.address)}`;
      window.open(directionsUrl, '_blank');
    } else {
      // Fallback to searching for the address
      const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.address)}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Find Lawyers in Your City
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* City Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select City</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city} {city === "Gwalior" && "(Recommended)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Or Use Current Location</label>
              <Button 
                onClick={getCurrentLocation}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? "Getting Location..." : "Use Current Location"}
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter city or pincode manually"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocationSubmit()}
            />
            <Button onClick={handleLocationSubmit} variant="outline">
              Set
            </Button>
          </div>
          
          {error && (
            <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {latitude && longitude && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              ✓ Location found: Showing lawyers near {selectedCity}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(value: string) => setSelectedCategory(value as keyof typeof categoryMap)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Business Law">Business Law</TabsTrigger>
          <TabsTrigger value="Personal Legal">Personal Legal</TabsTrigger>
          <TabsTrigger value="Contract Review">Contract Review</TabsTrigger>
        </TabsList>

        {Object.keys(categoryMap).map((cat) => (
          <TabsContent key={cat} value={cat} className="space-y-4">
            {/* Specialization Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {filteredLawyers.length} Lawyers Found in {selectedCity} for {cat}
              </h3>
              
              {filteredLawyers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">No lawyers found in {selectedCity} for this category.</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Try selecting a different city or adjusting your filters.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredLawyers.map((lawyer) => (
                    <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-lg">{lawyer.name}</h4>
                                {lawyer.verified && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-slate-600 dark:text-slate-400 text-sm">{lawyer.location}, {lawyer.city}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{lawyer.rating}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {lawyer.specialization.map((spec) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>

                          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            <p>Experience: {lawyer.experience} years</p>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {lawyer.phone}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCopyPhone(lawyer.phone)}
                                className="h-6 px-2"
                              >
                                {copiedPhone === lawyer.phone ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            <p className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {lawyer.address}
                            </p>
                            {lawyer.distance && (
                              <p className="text-blue-600 dark:text-blue-400 font-medium">
                                {lawyer.distance.toFixed(1)} km away
                              </p>
                            )}
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleCall(lawyer.phone, lawyer.name)}
                              className="flex-1"
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDirections(lawyer)}
                              className="flex-1"
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Directions
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Phone Modal */}
      <Dialog open={!!showPhoneModal} onOpenChange={() => setShowPhoneModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Number</DialogTitle>
            <DialogDescription>
              {showPhoneModal?.startsWith('Number not available') ? (
                showPhoneModal
              ) : (
                <>
                  Call the lawyer at: <strong>{showPhoneModal}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {showPhoneModal && !showPhoneModal.startsWith('Number not available') && (
            <div className="flex space-x-2">
              <Button onClick={() => handleCopyPhone(showPhoneModal)} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Number
              </Button>
              <Button onClick={() => setShowPhoneModal(null)} className="flex-1">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Disclaimer */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Disclaimer:</strong> This directory is for informational purposes only. 
            We do not endorse any specific lawyer or guarantee their services. 
            Please verify credentials and consult multiple lawyers before making decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
