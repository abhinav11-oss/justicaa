export interface Lawyer {
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

// Enhanced lawyer data with more lawyers across multiple cities and pincodes
export const lawyersDatabase: Lawyer[] = [
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
  // ... (rest of the mock data remains the same)
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
  // ... (and so on for all cities)
];

// Mapping from AI-detected category to lawyer specializations
export const aiCategoryToSpecialization: Record<string, string[]> = {
  'criminal': ["Criminal Law", "Cyber Law"],
  'family': ["Family Law", "Personal Legal"],
  'consumer': ["Consumer Law"],
  'property': ["Property Law", "Civil Law"],
  'constitutional': ["Civil Law"],
  'business': ["Business Law", "Corporate Law", "Contract Law", "Intellectual Property", "Tax Law"],
  'contract': ["Contract Law", "Business Law"],
  'employment': ["Employment Law"],
  'labour': ["Employment Law"],
  'rti': [], // No specific lawyer specialization for RTI
  'general': [],
};