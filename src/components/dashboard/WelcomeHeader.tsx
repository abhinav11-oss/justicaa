import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, ArrowUpRight } from "lucide-react";

interface WelcomeHeaderProps {
  name: string;
  onNewConversation: () => void;
}

export const WelcomeHeader = ({ name, onNewConversation }: WelcomeHeaderProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-card/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {t('dashboard.welcomeBack')}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {t('dashboard.hello', { name })}
              </h1>
              <p className="text-muted-foreground max-w-md">
                {t('dashboard.greeting')}
              </p>
            </div>
            <Button
              onClick={onNewConversation}
              className="gradient-primary text-white border-0 shadow-lg"
              size="lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              {t('dashboard.newConsultation')}
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};