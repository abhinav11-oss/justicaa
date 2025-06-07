import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Navigation, Filter, Star, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/hooks/useAuth";

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

// Enhanced lawyer data with coordinates
const lawyersDatabase: Lawyer[] = [
  {
    id: "1",
    name: "Adv. Rajesh Kumar",
    specialization: ["Criminal Law", "Family Law"],
    location: "Connaught Place",
    city: "New Delhi",
    pincode: "110001",
    phone: "+91-98765-43210",
    experience: 15,
    rating: 4.5,
    address: "Block A, Connaught Place, New Delhi - 110001",
    verified: true,
    latitude: 28.6315,
    longitude: 77.2167,
    distance: 2.3
  },
  {
    id: "2", 
    name: "Adv. Priya Sharma",
    specialization: ["Property Law", "Civil Law", "Business Law"],
    location: "Karol Bagh",
    city: "New Delhi",
    pincode: "110005",
    phone: "+91-98765-43211",
    experience: 12,
    rating: 4.7,
    address: "Main Market, Karol Bagh, New Delhi - 110005",
    verified: true,
    latitude: 28.6519,
    longitude: 77.1909,
    distance: 5.1
  },
  {
    id: "3",
    name: "Adv. Suresh Gupta",
    specialization: ["Business Law", "Contract Law", "Intellectual Property"],
    location: "Lajpat Nagar",
    city: "New Delhi", 
    pincode: "110024",
    phone: "+91-98765-43212",
    experience: 20,
    rating: 4.3,
    address: "Central Market, Lajpat Nagar, New Delhi - 110024",
    verified: true,
    latitude: 28.5677,
    longitude: 77.2431,
    distance: 8.7
  },
  {
    id: "4",
    name: "Adv. Meera Joshi",
    specialization: ["Consumer Law", "Employment Law", "Family Law"],
    location: "Rohini",
    city: "New Delhi",
    pincode: "110085",
    phone: "+91-98765-43213", 
    experience: 8,
    rating: 4.6,
    address: "Sector 3, Rohini, New Delhi - 110085",
    verified: false,
    latitude: 28.7041,
    longitude: 77.1025,
    distance: 12.4
  },
  {
    id: "5",
    name: "Adv. Amit Verma",
    specialization: ["Criminal Law", "Cyber Law"],
    location: "Dwarka",
    city: "New Delhi",
    pincode: "110075",
    phone: "+91-98765-43214",
    experience: 10,
    rating: 4.4,
    address: "Sector 12, Dwarka, New Delhi - 110075",
    verified: true,
    latitude: 28.5921,
    longitude: 77.0460,
    distance: 15.2
  },
  {
    id: "6",
    name: "Adv. Kavita Singh",
    specialization: ["Family Law", "Personal Legal"],
    location: "Vasant Kunj",
    city: "New Delhi",
    pincode: "110070",
    phone: "+91-98765-43215",
    experience: 18,
    rating: 4.8,
    address: "Mall Road, Vasant Kunj, New Delhi - 110070",
    verified: true,
    latitude: 28.5244,
    longitude: 77.1588,
    distance: 7.8
  }
];

export const LawyerFinder = ({ category }: LawyerFinderProps) => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [manualLocation, setManualLocation] = useState("");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { latitude, longitude, error, loading, getCurrentLocation, setManualLocation: setGeoLocation } = useGeolocation();

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
    "Personal Legal",
    "Intellectual Property"
  ];

  useEffect(() => {
    if (!user) {
      setLawyers([]);
      setFilteredLawyers([]);
      return;
    }

    // Auto-get location when component mounts for authenticated users
    getCurrentLocation();
    setLawyers(lawyersDatabase);
  }, [user]);

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
  }, [selectedSpecialization, category, lawyers]);

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

    // Filter by category if provided
    if (category && category !== "all") {
      const categoryMap: Record<string, string[]> = {
        "business": ["Business Law", "Contract Law", "Intellectual Property"],
        "personal": ["Family Law", "Personal Legal", "Consumer Law"],
        "contract": ["Contract Law", "Business Law"],
        "process": ["Civil Law", "Criminal Law"]
      };
      
      const relevantSpecs = categoryMap[category] || [];
      if (relevantSpecs.length > 0) {
        filtered = filtered.filter(lawyer => 
          lawyer.specialization.some(spec => relevantSpecs.includes(spec))
        );
      }
    }

    // Filter by specialization
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(lawyer => 
        lawyer.specialization.includes(selectedSpecialization)
      );
    }

    setFilteredLawyers(filtered);
  };

  const handleManualLocationSubmit = () => {
    if (!manualLocation.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a city or pincode",
        variant: "destructive"
      });
      return;
    }
    
    // For demo purposes, set a default location for manual input
    // In a real app, you'd geocode the address
    setGeoLocation(28.6139, 77.2090); // Delhi coordinates
    
    toast({
      title: "Location Set",
      description: `Location set to ${manualLocation}`,
    });
  };

  const handleCall = (phone: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access calling features",
        variant: "destructive"
      });
      return;
    }
    
    window.open(`tel:${phone}`, '_self');
  };

  const handleCopyPhone = async (phone: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
        variant: "destructive"
      });
      return;
    }

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
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access directions",
        variant: "destructive"
      });
      return;
    }

    if (latitude && longitude) {
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${lawyer.latitude},${lawyer.longitude}`;
      window.open(directionsUrl, '_blank');
    } else {
      const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.address)}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  if (!user) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6 text-center">
          <h4 className="text-lg font-medium text-amber-900 mb-2">Authentication Required</h4>
          <p className="text-amber-700 mb-4">Please sign in to find and contact lawyers near you.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Location Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Find Lawyers Near You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Button 
                onClick={getCurrentLocation}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? "Getting Location..." : "Use Current Location"}
              </Button>
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Enter city or pincode"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleManualLocationSubmit()}
              />
              <Button onClick={handleManualLocationSubmit} variant="outline">
                Set
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {latitude && longitude && (
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              Location found: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </div>
          )}
          
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
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {filteredLawyers.length} Lawyers Found
          {category && ` for ${category.charAt(0).toUpperCase() + category.slice(1)} Law`}
        </h3>
        
        {filteredLawyers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-slate-600">No lawyers found matching your criteria.</p>
              <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or search area.</p>
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
                        <p className="text-slate-600 text-sm">{lawyer.location}, {lawyer.city}</p>
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

                    <div className="text-sm text-slate-600 space-y-1">
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
                        <p className="text-blue-600 font-medium">
                          {lawyer.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleCall(lawyer.phone)}
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

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800">
            <strong>Disclaimer:</strong> This directory is for informational purposes only. 
            We do not endorse any specific lawyer or guarantee their services. 
            Please verify credentials and consult multiple lawyers before making decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};