import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MapPin, User, Save, Upload, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SettingsPanel = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Gwalior",
    avatar: "",
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveProfile = () => {
    toast({
      title: t('settings.profileSaved'),
      description: t('settings.profileUpdated'),
    });
    setUnsavedChanges(false);
  };

  const handleAvatarUpload = () => {
    toast({
      title: "Avatar Upload",
      description: "Avatar upload functionality coming soon",
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem("lastTab");
      localStorage.removeItem("trialMode");
      localStorage.removeItem("trialMessagesUsed");
      toast({
        title: t('settings.signedOut'),
        description: t('settings.signedOutDesc'),
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: t('common.error'),
        description: "There was an issue signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cities = [
    "Gwalior", "Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore",
    "Hyderabad", "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow",
    "Kanpur", "Nagpur", "Indore", "Bhopal", "Visakhapatnam", "Patna",
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            {t('settings.profile')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-lg">
                {profile.name.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={handleAvatarUpload}>
              <Upload className="h-4 w-4 mr-2" />
              {t('settings.avatar')}
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('settings.fullName')}</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => handleProfileChange("name", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email">{t('settings.email')}</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange("email", e.target.value)}
                placeholder="Enter your email"
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">
                {t('settings.emailCannotChange')}
              </p>
            </div>

            <div>
              <Label htmlFor="phone">{t('settings.phone')}</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleProfileChange("phone", e.target.value)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <Label htmlFor="location">{t('settings.location')}</Label>
              <Select
                value={profile.location}
                onValueChange={(value) =>
                  handleProfileChange("location", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {city}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {unsavedChanges && (
            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                {t('settings.save')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.account')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t('settings.authMethod')}</Label>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {user?.app_metadata?.provider === "google"
                ? t('settings.googleAccount')
                : t('settings.emailPassword')}
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>{t('settings.dataPrivacy')}</Label>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t('settings.dataPrivacyDesc')}
            </p>
          </div>

          <div className="pt-4">
            <Button 
              variant="destructive" 
              onClick={handleSignOut} 
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('settings.signOut')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};