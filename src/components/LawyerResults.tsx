import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Navigation, Star, Award, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  distance?: number;
}

interface LawyerResultsProps {
  onClose: () => void;
}

// Mock lawyer data - in a real app, this would come from an API
const mockLawyers: Lawyer[] = [
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
    distance: 2.3
  },
  {
    id: "2", 
    name: "Adv. Priya Sharma",
    specialization: ["Property Law", "Civil Law"],
    location: "Karol Bagh",
    city: "New Delhi",
    pincode: "110005",
    phone: "+91-98765-43211",
    experience: 12,
    rating: 4.7,
    address: "Main Market, Karol Bagh, New Delhi - 110005",
    verified: true,
    distance: 5.1
  },
  {
    id: "3",
    name: "Adv. Suresh Gupta",
    specialization: ["Business Law", "Contract Law"],
    location: "Lajpat Nagar",
    city: "New Delhi", 
    pincode: "110024",
    phone: "+91-98765-43212",
    experience: 20,
    rating: 4.3,
    address: "Central Market, Lajpat Nagar, New Delhi - 110024",
    verified: true,
    distance: 8.7
  },
  {
    id: "4",
    name: "Adv. Meera Joshi",
    specialization: ["Consumer Law", "Employment Law"],
    location: "Rohini",
    city: "New Delhi",
    pincode: "110085",
    phone: "+91-98765-43213", 
    experience: 8,
    rating: 4.6,
    address: "Sector 3, Rohini, New Delhi - 110085",
    verified: false,
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
    distance: 15.2
  },
  {
    id: "6",
    name: "Adv. Kavita Singh",
    specialization: ["Family Law", "Divorce Law"],
    location: "Vasant Kunj",
    city: "New Delhi",
    pincode: "110070",
    phone: "+91-98765-43215",
    experience: 18,
    rating: 4.8,
    address: "Mall Road, Vasant Kunj, New Delhi - 110070",
    verified: true,
    distance: 7.8
  }
];

export function LawyerResults({ onClose }: LawyerResultsProps) {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [userLocation, setUserLocation] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`${latitude}, ${longitude}`);
          setLocationDenied(false);
          loadLawyers();
          toast({
            title: "Location Found",
            description: "Showing lawyers near your current location",
          });
        },
        (error) => {
          console.error("Location error:", error);
          setLocationDenied(true);
          setLoading(false);
          toast({
            title: "Location Access Denied",
            description: "Please enter your city or pincode to find nearby lawyers",
            variant: "destructive"
          });
        }
      );
    } else {
      setLocationDenied(true);
      setLoading(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Please enter your city or pincode to find nearby lawyers",
        variant: "destructive"
      });
    }
  };

  const loadLawyers = () => {
    // Simulate API call delay
    setTimeout(() => {
      const sortedLawyers = [...mockLawyers].sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setLawyers(sortedLawyers);
      setLoading(false);
    }, 1000);
  };

  const searchByManualLocation = () => {
    if (!manualLocation.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a city or pincode",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setUserLocation(manualLocation);
    
    // Filter lawyers based on manual location
    const filteredLawyers = mockLawyers.filter(lawyer => 
      lawyer.city.toLowerCase().includes(manualLocation.toLowerCase()) ||
      lawyer.pincode.includes(manualLocation) ||
      lawyer.location.toLowerCase().includes(manualLocation.toLowerCase())
    );
    
    setTimeout(() => {
      setLawyers(filteredLawyers);
      setLoading(false);
      toast({
        title: "Search Complete",
        description: `Found ${filteredLawyers.length} lawyers in ${manualLocation}`,
      });
    }, 1000);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : i < rating 
            ? 'fill-yellow-200 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Finding lawyers near you...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Lawyers Near You
              </CardTitle>
              {userLocation && (
                <p className="text-sm text-slate-600 mt-1">
                  Location: {userLocation}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
          
          {locationDenied && (
            <div className="flex space-x-2 mt-4">
              <Input
                placeholder="Enter city or pincode"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchByManualLocation()}
              />
              <Button onClick={searchByManualLocation}>Search</Button>
              <Button variant="outline" onClick={getCurrentLocation}>
                Try Location Again
              </Button>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          {lawyers.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p className="text-slate-600">No lawyers found in your area.</p>
              <p className="text-sm text-slate-500 mt-2">Try searching with a different location.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {lawyers.map((lawyer) => (
                <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-lg">{lawyer.name}</h4>
                            {lawyer.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Award className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-600 text-sm">{lawyer.location}, {lawyer.city}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(lawyer.rating)}
                          <span className="text-sm font-medium ml-1">{lawyer.rating}</span>
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
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-2" />
                          <span>{lawyer.experience} years experience</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span>{lawyer.address}</span>
                        </div>
                        {lawyer.distance && (
                          <p className="text-blue-600 font-medium">
                            {lawyer.distance} km away
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
                          onClick={() => handleDirections(lawyer.address)}
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
        </CardContent>
      </Card>
    </div>
  );
}