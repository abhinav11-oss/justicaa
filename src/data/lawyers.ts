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

export const lawyersDatabase: Lawyer[] = [];

export const aiCategoryToSpecialization: Record<string, string[]> = {
  criminal: ["Criminal Law", "Cyber Law"],
  family: ["Family Law", "Personal Legal"],
  consumer: ["Consumer Law"],
  property: ["Property Law", "Civil Law"],
  constitutional: ["Civil Law"],
  business: ["Business Law", "Corporate Law", "Contract Law", "Intellectual Property", "Tax Law"],
  contract: ["Contract Law", "Business Law"],
  employment: ["Employment Law"],
  labour: ["Employment Law"],
  rti: [],
  general: [],
};
