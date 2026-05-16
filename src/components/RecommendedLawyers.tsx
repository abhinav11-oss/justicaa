import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, Navigation, Sparkles, MapPin, AlertCircle } from "lucide-react";
import { lawyersDatabase, aiCategoryToSpecialization, Lawyer } from "@/data/lawyers";

interface RecommendedLawyersProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  city: string | null;
}

export const RecommendedLawyers = ({ isOpen, onClose, category, city }: RecommendedLawyersProps) => {
  const [recommended, setRecommended] = useState<Lawyer[]>([]);

  useEffect(() => {
    if (isOpen) {
      const specializations = aiCategoryToSpecialization[category] || [];
      if (specializations.length === 0) {
        setRecommended([]);
        return;
      }

      let potentialMatches = lawyersDatabase.filter(lawyer =>
        lawyer.specialization.some(spec => specializations.includes(spec))
      );

      if (city) {
        const cityMatches = potentialMatches.filter(lawyer => lawyer.city.toLowerCase() === city.toLowerCase());
        if (cityMatches.length > 0) {
          potentialMatches = cityMatches;
        }
      }

      potentialMatches.sort((a, b) => b.rating - a.rating);
      setRecommended(potentialMatches.slice(0, 3));
    }
  }, [isOpen, category, city]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Recommended Lawyers for Your Case
          </DialogTitle>
          <DialogDescription>
            Based on your conversation about <span className="font-semibold capitalize">{category}</span> law, here are some top-rated lawyers who may be able to help.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!city && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">For better results, please set your location in your profile settings.</p>
            </div>
          )}
          {recommended.length > 0 ? (
            recommended.map(lawyer => (
              <Card key={lawyer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-2 space-y-2">
                      <h4 className="font-semibold">{lawyer.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center"><MapPin className="h-3 w-3 mr-1" />{lawyer.location}, {lawyer.city}</p>
                      <div className="flex flex-wrap gap-1">
                        {lawyer.specialization.map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                      </div>
                      <p className="text-xs text-primary pt-1">
                        <strong>Match Reason:</strong> Specializes in {lawyer.specialization.find(s => aiCategoryToSpecialization[category]?.includes(s))} and has a high rating.
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center space-x-1"><Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> <span className="font-bold text-lg">{lawyer.rating}</span></div>
                      <Button size="sm" className="w-full" onClick={() => window.open(`tel:${lawyer.phone}`)}><Phone className="h-4 w-4 mr-2" />Call</Button>
                      <Button size="sm" variant="outline" className="w-full" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.address)}`)}><Navigation className="h-4 w-4 mr-2" />Directions</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">We couldn't find a specialized lawyer match for this topic. You can browse all lawyers in the "Find a Lawyer" section.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};