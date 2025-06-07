
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Navigation, Filter, Star } from "lucide-react";
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
  distance?: number;
}

// Sample lawyer data - in a real app, this would come from a database
const sampleLawyers: Lawyer[] = [
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
    distance: 15.2
  }
];

export const LawyerFinder = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>(sampleLawyers);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(sampleLawyers);
  const [userLocation, setUserLocation] = useState<string>("");
  const [searchPincode, setSearchPincode] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const specializations = [
    "Criminal Law",
    "Family Law", 
    "Property Law",
    "Civil Law",
    "Business Law",
    "Contract Law",
    "Consumer Law",
    "Employment Law",
    "Cyber Law"
  ];

  useEffect(() => {
    filterLawyers();
  }, [selectedSpecialization, searchPincode]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`${latitude}, ${longitude}`);
          toast({
            title: "Location Found",
            description: "Showing lawyers near your current location",
          });
          // In a real app, you would use the coordinates to calculate distances
          // and sort lawyers by proximity
          sortLawyersByDistance();
          setLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          toast({
            title: "Location Access Denied",
            description: "Please enter your pincode to find nearby lawyers",
            variant: "destructive"
          });
          setLoading(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Please enter your pincode to find nearby lawyers",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const sortLawyersByDistance = () => {
    const sorted = [...lawyers].sort((a, b) => (a.distance || 0) - (b.distance || 0));
    setLawyers(sorted);
    setFilteredLawyers(sorted);
  };

  const filterLawyers = () => {
    let filtered = lawyers;

    // Filter by specialization
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(lawyer => 
        lawyer.specialization.includes(selectedSpecialization)
      );
    }

    // Filter by pincode if provided
    if (searchPincode) {
      filtered = filtered.filter(lawyer => 
        lawyer.pincode.includes(searchPincode) || 
        lawyer.city.toLowerCase().includes(searchPincode.toLowerCase())
      );
    }

    setFilteredLawyers(filtered);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
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
            <div className="flex-1">
              <Input
                placeholder="Enter pincode or city"
                value={searchPincode}
                onChange={(e) => setSearchPincode(e.target.value)}
              />
            </div>
          </div>
          
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
                        <h4 className="font-semibold text-lg">{lawyer.name}</h4>
                        <p className="text-slate-600 text-sm">{lawyer.location}, {lawyer.city}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{lawyer.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {lawyer.specialization.map((spec) => (
                        <Badge key={spec} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    <div className="text-sm text-slate-600 space-y-1">
                      <p>Experience: {lawyer.experience} years</p>
                      <p className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {lawyer.address}
                      </p>
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
