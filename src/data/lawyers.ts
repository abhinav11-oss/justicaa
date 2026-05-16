// This file is no longer used for the main LawyerFinder component.
// Lawyers are now fetched live from Google Places via the find-lawyers Edge Function.
// Keeping this file only for the aiCategoryToSpecialization mapping used by RecommendedLawyers.

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
  'rti': [],
  'general': [],
  'ndps': ["Criminal Law"],
};