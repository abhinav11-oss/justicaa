
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

// Enhanced lawyer data with more lawyers across multiple cities and pincodes
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
  // Delhi Lawyers
  {
    id: "5",
    name: "Adv. Amit Verma",
    specialization: ["Criminal Law", "Cyber Law"],
    location: "Connaught Place",
    city: "Delhi",
    pincode: "110001",
    phone: "+91-98765-43214",
    experience: 10,
    rating: 4.4,
    address: "Chamber No. 12, Lawyer's Colony, Connaught Place, Delhi - 110001",
    verified: true,
    latitude: 28.6139,
    longitude: 77.2090
  },
  {
    id: "6",
    name: "Adv. Kavita Singh",
    specialization: ["Family Law", "Personal Legal"],
    location: "Karol Bagh",
    city: "Delhi",
    pincode: "110005",
    phone: "+91-98765-43215",
    experience: 18,
    rating: 4.8,
    address: "Near Metro Station, Karol Bagh, Delhi - 110005",
    verified: true,
    latitude: 28.6519,
    longitude: 77.1909
  },
  {
    id: "30",
    name: "Adv. Rohit Sharma",
    specialization: ["Criminal Law", "Civil Law"],
    location: "Lajpat Nagar",
    city: "Delhi",
    pincode: "110024",
    phone: "+91-98765-43230",
    experience: 14,
    rating: 4.6,
    address: "Central Market, Lajpat Nagar, Delhi - 110024",
    verified: true,
    latitude: 28.5665,
    longitude: 77.2431
  },
  // Mumbai Lawyers
  {
    id: "7",
    name: "Adv. Ravi Patel",
    specialization: ["Business Law", "Corporate Law", "Tax Law"],
    location: "Bandra",
    city: "Mumbai",
    pincode: "400050",
    phone: "+91-98765-43216",
    experience: 14,
    rating: 4.5,
    address: "Linking Road, Bandra West, Mumbai - 400050",
    verified: true,
    latitude: 19.0596,
    longitude: 72.8295
  },
  {
    id: "8",
    name: "Adv. Sunita Agarwal",
    specialization: ["Contract Law", "Employment Law", "Civil Law"],
    location: "Andheri",
    city: "Mumbai",
    pincode: "400058",
    phone: "+91-98765-43217",
    experience: 11,
    rating: 4.6,
    address: "Western Express Highway, Andheri East, Mumbai - 400058",
    verified: true,
    latitude: 19.1136,
    longitude: 72.8697
  },
  {
    id: "31",
    name: "Adv. Neha Kapoor",
    specialization: ["Family Law", "Property Law"],
    location: "Powai",
    city: "Mumbai",
    pincode: "400076",
    phone: "+91-98765-43231",
    experience: 9,
    rating: 4.4,
    address: "Hiranandani Gardens, Powai, Mumbai - 400076",
    verified: true,
    latitude: 19.1197,
    longitude: 72.9073
  },
  // Bangalore Lawyers
  {
    id: "9",
    name: "Adv. Deepak Kumar",
    specialization: ["Business Law", "Intellectual Property", "Corporate Law"],
    location: "Koramangala",
    city: "Bangalore",
    pincode: "560034",
    phone: "+91-98765-43218",
    experience: 16,
    rating: 4.7,
    address: "5th Block, Koramangala, Bangalore - 560034",
    verified: true,
    latitude: 12.9352,
    longitude: 77.6245
  },
  {
    id: "10",
    name: "Adv. Sneha Reddy",
    specialization: ["Family Law", "Criminal Law", "Consumer Law"],
    location: "Jayanagar",
    city: "Bangalore",
    pincode: "560011",
    phone: "+91-98765-43219",
    experience: 9,
    rating: 4.4,
    address: "4th Block, Jayanagar, Bangalore - 560011",
    verified: true,
    latitude: 12.9279,
    longitude: 77.5937
  },
  {
    id: "32",
    name: "Adv. Arun Krishnan",
    specialization: ["Business Law", "Tax Law"],
    location: "Electronic City",
    city: "Bangalore",
    pincode: "560100",
    phone: "+91-98765-43232",
    experience: 13,
    rating: 4.5,
    address: "Electronic City Phase 1, Bangalore - 560100",
    verified: true,
    latitude: 12.8456,
    longitude: 77.6603
  },
  // Jhansi Lawyers
  {
    id: "11",
    name: "Adv. Rakesh Tiwari",
    specialization: ["Criminal Law", "Family Law"],
    location: "Civil Lines",
    city: "Jhansi",
    pincode: "284001",
    phone: "+91-98765-43220",
    experience: 12,
    rating: 4.3,
    address: "Near District Court, Civil Lines, Jhansi - 284001",
    verified: true,
    latitude: 25.4484,
    longitude: 78.5685
  },
  {
    id: "12",
    name: "Adv. Sushma Sharma",
    specialization: ["Property Law", "Civil Law"],
    location: "Sadar Bazaar",
    city: "Jhansi",
    pincode: "284003",
    phone: "+91-98765-43221",
    experience: 8,
    rating: 4.2,
    address: "Main Market, Sadar Bazaar, Jhansi - 284003",
    verified: false,
    latitude: 25.4540,
    longitude: 78.5732
  },
  // Bhopal Lawyers
  {
    id: "13",
    name: "Adv. Vinod Kumar",
    specialization: ["Business Law", "Contract Law"],
    location: "MP Nagar",
    city: "Bhopal",
    pincode: "462011",
    phone: "+91-98765-43222",
    experience: 16,
    rating: 4.6,
    address: "Zone 1, MP Nagar, Bhopal - 462011",
    verified: true,
    latitude: 23.2599,
    longitude: 77.4126
  },
  {
    id: "14",
    name: "Adv. Rekha Jain",
    specialization: ["Consumer Law", "Employment Law"],
    location: "Arera Colony",
    city: "Bhopal",
    pincode: "462016",
    phone: "+91-98765-43223",
    experience: 10,
    rating: 4.4,
    address: "E-5, Arera Colony, Bhopal - 462016",
    verified: true,
    latitude: 23.2156,
    longitude: 77.4304
  },
  // Indore Lawyers
  {
    id: "15",
    name: "Adv. Mahesh Patel",
    specialization: ["Criminal Law", "Civil Law"],
    location: "Vijay Nagar",
    city: "Indore",
    pincode: "452010",
    phone: "+91-98765-43224",
    experience: 14,
    rating: 4.5,
    address: "Scheme 54, Vijay Nagar, Indore - 452010",
    verified: true,
    latitude: 22.7196,
    longitude: 75.8577
  },
  {
    id: "16",
    name: "Adv. Anita Singh",
    specialization: ["Family Law", "Property Law"],
    location: "Old Palasia",
    city: "Indore",
    pincode: "452001",
    phone: "+91-98765-43225",
    experience: 11,
    rating: 4.3,
    address: "Palasia Square, Indore - 452001",
    verified: false,
    latitude: 22.7239,
    longitude: 75.8570
  },
  // Ujjain Lawyers
  {
    id: "17",
    name: "Adv. Ramesh Dubey",
    specialization: ["Business Law", "Tax Law"],
    location: "Freeganj",
    city: "Ujjain",
    pincode: "456010",
    phone: "+91-98765-43226",
    experience: 18,
    rating: 4.7,
    address: "Freeganj Market, Ujjain - 456010",
    verified: true,
    latitude: 23.1765,
    longitude: 75.7885
  },
  {
    id: "18",
    name: "Adv. Geeta Sharma",
    specialization: ["Consumer Law", "Criminal Law"],
    location: "Mahakal Road",
    city: "Ujjain",
    pincode: "456006",
    phone: "+91-98765-43227",
    experience: 7,
    rating: 4.1,
    address: "Near Mahakaleshwar Temple, Ujjain - 456006",
    verified: true,
    latitude: 23.1828,
    longitude: 75.7772
  }
];

const categoryMap = {
  "Business Law": ["Business Law", "Corporate Law", "Tax Law", "Contract Law", "Intellectual Property"],
  "Personal Legal": ["Family Law", "Personal Legal", "Consumer Law", "Employment Law"],
  "Contract Review": ["Contract Law", "Business Law", "Employment Law", "Civil Law"]
};

// Enhanced city coordinates with more accurate locations
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

// Enhanced pincode to city mapping
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
  const [lawyers, setLawyers] = useState<Lawyer[]>(lawyersDatabase);
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryMap>("Business Law");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [userCity, setUserCity] = useState<string>("");
  const [manualLocation, setManualLocation] = useState("");
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>("");
  const { toast } = useToast();
  const { latitude, longitude, error, loading, getCurrentLocation, setManualLocation: setGeoLocation } = useGeolocation();

  const specializations = [
    "Criminal Law", "Family Law", "Property Law", "Civil Law", "Business Law", "Contract Law",
    "Consumer Law", "Employment Law", "Cyber Law", "Personal Legal", "Intellectual Property",
    "Corporate Law", "Tax Law"
  ];

  const cities = ["Gwalior", "Delhi", "Mumbai", "Bangalore", "Jhansi", "Bhopal", "Indore", "Ujjain"];

  // Improved distance calculation using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
  };

  // Enhanced city detection from coordinates
  const detectCityFromCoordinates = (lat: number, lng: number): string => {
    let closestCity = "Gwalior";
    let minDistance = Infinity;

    Object.entries(cityCoordinates).forEach(([city, coords]) => {
      const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    return closestCity;
  };

  // Enhanced pincode detection
  const detectCityFromPincode = (pincode: string): string | null => {
    // Remove any spaces and get first 6 digits
    const cleanPincode = pincode.replace(/\s/g, '').substring(0, 6);
    return pincodeToCity[cleanPincode] || null;
  };

  useEffect(() => {
    setLawyers(lawyersDatabase);
    // Initialize with all lawyers
    setFilteredLawyers(lawyersDatabase);
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      // Detect user's city based on coordinates
      const detectedCity = detectCityFromCoordinates(latitude, longitude);
      setUserCity(detectedCity);
      setLocationStatus(`Location detected: ${detectedCity}`);
      
      // Calculate distances for all lawyers
      const lawyersWithDistance = lawyersDatabase.map(lawyer => ({
        ...lawyer,
        distance: calculateDistance(latitude, longitude, lawyer.latitude, lawyer.longitude)
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setLawyers(lawyersWithDistance);
      
      toast({
        title: "Location Detected",
        description: `Found your location near ${detectedCity}`,
      });
    }
  }, [latitude, longitude, toast]);

  useEffect(() => {
    filterLawyers();
  }, [selectedSpecialization, selectedCategory, userCity, lawyers]);

  useEffect(() => {
    if (category && categoryMap[category as keyof typeof categoryMap]) {
      setSelectedCategory(category as keyof typeof categoryMap);
    }
  }, [category]);

  useEffect(() => {
    if (error) {
      setLocationStatus("Location access denied. Please select your city manually or enable location permissions.");
    }
  }, [error]);

  const filterLawyers = () => {
    let filtered = [...lawyers];

    // Filter by user's detected city or nearby locations
    if (userCity) {
      // Show lawyers from user's city first, then nearby cities within reasonable distance
      filtered = filtered.filter(lawyer => {
        if (lawyer.city === userCity) return true;
        // Include lawyers within 50km if distance is available
        return lawyer.distance !== undefined && lawyer.distance <= 50;
      });
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

    // Sort by distance if available, otherwise by rating
    filtered.sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return b.rating - a.rating;
    });

    setFilteredLawyers(filtered);
  };

  const handleLocationSubmit = () => {
    if (!manualLocation.trim()) {
      toast({
        title: "Location Required",
        description: "Please enter a city name or pincode",
        variant: "destructive"
      });
      return;
    }
    
    const inputLocation = manualLocation.trim();
    
    // Check if it's a pincode (6 digits)
    const pincodeMatch = inputLocation.match(/^\d{6}$/);
    if (pincodeMatch) {
      const detectedCity = detectCityFromPincode(inputLocation);
      if (detectedCity && cityCoordinates[detectedCity]) {
        const coords = cityCoordinates[detectedCity];
        setGeoLocation(coords.lat, coords.lng);
        setUserCity(detectedCity);
        setLocationStatus(`Location set to: ${detectedCity} (Pincode: ${inputLocation})`);
        toast({
          title: "Location Set",
          description: `Found ${detectedCity} for pincode ${inputLocation}`,
        });
        return;
      } else {
        toast({
          title: "Pincode Not Found",
          description: `Pincode ${inputLocation} not found in our database.`,
          variant: "destructive"
        });
        return;
      }
    }
    
    // Check if it's a city name
    const matchedCity = cities.find(city => 
      city.toLowerCase().includes(inputLocation.toLowerCase()) ||
      inputLocation.toLowerCase().includes(city.toLowerCase())
    );
    
    if (matchedCity && cityCoordinates[matchedCity]) {
      const coords = cityCoordinates[matchedCity];
      setGeoLocation(coords.lat, coords.lng);
      setUserCity(matchedCity);
      setLocationStatus(`Location set to: ${matchedCity}`);
      toast({
        title: "Location Set",
        description: `Location set to ${matchedCity}`,
      });
    } else {
      toast({
        title: "Location Not Found",
        description: `${inputLocation} not found. Please try a different city or pincode.`,
        variant: "destructive"
      });
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    if (cityCoordinates[selectedCity]) {
      const coords = cityCoordinates[selectedCity];
      setGeoLocation(coords.lat, coords.lng);
      setUserCity(selectedCity);
      setLocationStatus(`Location set to: ${selectedCity}`);
      toast({
        title: "City Selected",
        description: `Showing lawyers in ${selectedCity}`,
      });
    }
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
          {/* Location Status */}
          {locationStatus && (
            <div className="text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg">
              {locationStatus}
            </div>
          )}

          {/* City Selection and Location Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select City</label>
              <Select value={userCity} onValueChange={handleCitySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Use Current Location</label>
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
              placeholder="Enter city name or 6-digit pincode"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocationSubmit()}
            />
            <Button onClick={handleLocationSubmit} variant="outline">
              Search
            </Button>
          </div>
          
          {error && (
            <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
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
                {filteredLawyers.length} Lawyers Found {userCity ? `in and around ${userCity}` : ''} for {cat}
              </h3>
              
              {filteredLawyers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-400">
                      No lawyers found {userCity ? `in ${userCity}` : ''} for this category.
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                      Try selecting a different city or adjusting your filters.
                    </p>
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
                              <p className="text-slate-600 dark:text-slate-400 text-sm">
                                {lawyer.location}, {lawyer.city} - {lawyer.pincode}
                              </p>
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
                            {lawyer.distance !== undefined && (
                              <p className="text-blue-600 dark:text-blue-400 font-medium">
                                {lawyer.distance} km away
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
