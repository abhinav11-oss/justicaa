import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeeDetails {
  courtFee: string;
  advocateFee: string;
  misc: string;
}

const caseTypes = [
  "Property Registration",
  "Mutual Divorce",
  "Cheque Bounce Case",
  "Bail Application",
  "Consumer Complaint",
  "Company Registration",
];

const cities = ["Gwalior", "Delhi", "Mumbai", "Bangalore", "Bhopal", "Indore", "Jaipur", "Lucknow"];

const feeData: Record<string, Record<string, FeeDetails>> = {
  "Gwalior": {
    "Property Registration": { courtFee: "1% of property value + registration fee", advocateFee: "₹15,000 - ₹30,000", misc: "₹5,000" },
    "Mutual Divorce": { courtFee: "₹1,000 - ₹2,000", advocateFee: "₹20,000 - ₹50,000", misc: "₹3,000" },
    "Cheque Bounce Case": { courtFee: "Varies by cheque amount", advocateFee: "₹15,000 - ₹40,000", misc: "₹4,000" },
    "Bail Application": { courtFee: "₹500 - ₹1,500", advocateFee: "₹10,000 - ₹35,000", misc: "₹2,000" },
    "Consumer Complaint": { courtFee: "Nil up to ₹5 Lakh", advocateFee: "₹10,000 - ₹25,000", misc: "₹2,500" },
    "Company Registration": { courtFee: "Govt. fees approx. ₹7,000", advocateFee: "₹15,000 - ₹25,000", misc: "₹3,000" },
  },
  "Delhi": {
    "Property Registration": { courtFee: "1% of property value + registration fee", advocateFee: "₹30,000 - ₹75,000", misc: "₹10,000" },
    "Mutual Divorce": { courtFee: "₹2,000 - ₹3,000", advocateFee: "₹40,000 - ₹1,00,000", misc: "₹5,000" },
    "Cheque Bounce Case": { courtFee: "Varies by cheque amount", advocateFee: "₹25,000 - ₹60,000", misc: "₹6,000" },
    "Bail Application": { courtFee: "₹1,000 - ₹2,500", advocateFee: "₹25,000 - ₹70,000", misc: "₹4,000" },
    "Consumer Complaint": { courtFee: "Nil up to ₹5 Lakh", advocateFee: "₹20,000 - ₹50,000", misc: "₹5,000" },
    "Company Registration": { courtFee: "Govt. fees approx. ₹7,000", advocateFee: "₹20,000 - ₹40,000", misc: "₹5,000" },
  },
  "Mumbai": {
    "Property Registration": { courtFee: "1% of property value + registration fee", advocateFee: "₹50,000 - ₹1,50,000", misc: "₹15,000" },
    "Mutual Divorce": { courtFee: "₹2,500 - ₹5,000", advocateFee: "₹50,000 - ₹1,50,000", misc: "₹7,000" },
    "Cheque Bounce Case": { courtFee: "Varies by cheque amount", advocateFee: "₹30,000 - ₹80,000", misc: "₹8,000" },
    "Bail Application": { courtFee: "₹1,500 - ₹3,000", advocateFee: "₹35,000 - ₹1,00,000", misc: "₹6,000" },
    "Consumer Complaint": { courtFee: "Nil up to ₹5 Lakh", advocateFee: "₹25,000 - ₹60,000", misc: "₹7,000" },
    "Company Registration": { courtFee: "Govt. fees approx. ₹7,000", advocateFee: "₹25,000 - ₹50,000", misc: "₹6,000" },
  },
  "Bangalore": {
    "Property Registration": { courtFee: "1% of property value + registration fee", advocateFee: "₹40,000 - ₹1,00,000", misc: "₹12,000" },
    "Mutual Divorce": { courtFee: "₹2,000 - ₹4,000", advocateFee: "₹45,000 - ₹1,20,000", misc: "₹6,000" },
    "Cheque Bounce Case": { courtFee: "Varies by cheque amount", advocateFee: "₹28,000 - ₹70,000", misc: "₹7,000" },
    "Bail Application": { courtFee: "₹1,200 - ₹2,800", advocateFee: "₹30,000 - ₹80,000", misc: "₹5,000" },
    "Consumer Complaint": { courtFee: "Nil up to ₹5 Lakh", advocateFee: "₹22,000 - ₹55,000", misc: "₹6,000" },
    "Company Registration": { courtFee: "Govt. fees approx. ₹7,000", advocateFee: "₹22,000 - ₹45,000", misc: "₹5,500" },
  },
};

export const LegalFeeCalculator = () => {
  const [caseType, setCaseType] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [estimatedCosts, setEstimatedCosts] = useState<FeeDetails | null>(null);

  const handleCalculate = () => {
    if (caseType && city && feeData[city] && feeData[city][caseType]) {
      setEstimatedCosts(feeData[city][caseType]);
    } else {
      setEstimatedCosts(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Legal Fee Calculator</h2>
        <p className="text-muted-foreground mt-2">
          Estimate Your Legal Costs in Gwalior and Across India.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Estimation Tool</CardTitle>
          <CardDescription>Select a case type and city to get an estimate.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={caseType} onValueChange={setCaseType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Case Type" />
              </SelectTrigger>
              <SelectContent>
                {caseTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCalculate} disabled={!caseType || !city} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {estimatedCosts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Estimated Costs</CardTitle>
                <CardDescription>For a {caseType} in {city}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <span className="font-medium">Court Fees / Stamp Duty</span>
                  <span className="font-semibold flex items-center"><IndianRupee className="h-4 w-4 mr-1" />{estimatedCosts.courtFee}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <span className="font-medium">Advocate's Professional Fees</span>
                  <span className="font-semibold flex items-center"><IndianRupee className="h-4 w-4 mr-1" />{estimatedCosts.advocateFee}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                  <span className="font-medium">Miscellaneous Expenses</span>
                  <span className="font-semibold flex items-center"><IndianRupee className="h-4 w-4 mr-1" />{estimatedCosts.misc}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground text-center pt-4">
        Disclaimer: These are general estimates for informational purposes only. Actual costs may vary based on the complexity of the case, the advocate's experience, and other factors.
      </p>
    </div>
  );
};