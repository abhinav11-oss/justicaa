import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Clock,
  Shield,
  Gavel,
  IndianRupee,
  Languages,
  CheckCircle,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility

export const Benefits = () => {
  const [hoveredMainBenefitIndex, setHoveredMainBenefitIndex] = useState<number | null>(null);
  const [hoveredAdditionalBenefitIndex, setHoveredAdditionalBenefitIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const mainBenefits = [
    {
      icon: IndianRupee,
      title: "Affordable Legal Help",
      description:
        "Get professional legal guidance at a fraction of traditional consultation costs. Free basic consultations with premium options available.",
      stat: "90% Cost Savings",
      details: [
        "Free basic consultation",
        "Transparent pricing",
        "No hidden fees",
      ],
    },
    {
      icon: Clock,
      title: "Instant Access",
      description:
        "No more waiting weeks for lawyer appointments. Get immediate legal guidance whenever you need it, day or night.",
      stat: "24/7 Available",
      details: [
        "Immediate responses",
        "No appointment needed",
        "Weekend support",
      ],
    },
    {
      icon: Languages,
      title: "Multilingual Support",
      description:
        "Communicate in your preferred language. We support Hindi, English, and major regional languages across India.",
      stat: "10+ Languages",
      details: ["Hindi & English", "Regional languages", "Voice support"],
    },
  ];

  const additionalBenefits = [
    {
      icon: Shield,
      title: "Verified Information",
      description:
        "All legal guidance is based on current Indian laws and verified by legal experts",
    },
    {
      icon: CheckCircle,
      title: "Compliance Assured",
      description:
        "Documents and advice comply with latest legal standards and court requirements",
    },
    {
      icon: Users,
      title: "Expert Network",
      description:
        "Access to network of 500+ verified lawyers across India when needed",
    },
    {
      icon: Star,
      title: "Trusted Platform",
      description:
        "Rated 4.8/5 by users with thousands of successful legal resolutions",
    },
  ];

  const comparisonData = [
    {
      aspect: "Consultation Cost",
      traditional: "₹2,000-5,000",
      justicaa: "Free-₹500",
    },
    { aspect: "Waiting Time", traditional: "1-2 weeks", justicaa: "Instant" },
    { aspect: "Availability", traditional: "Office hours", justicaa: "24/7" },
    {
      aspect: "Language Support",
      traditional: "Limited",
      justicaa: "10+ Languages",
    },
    {
      aspect: "Document Generation",
      traditional: "₹5,000+",
      justicaa: "₹200-500",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Why Choose Justicaa
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Smart Way to Handle Legal Matters
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the difference of modern, AI-powered legal assistance
            designed specifically for India
          </p>
        </motion.div>

        {/* Main Benefits */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {mainBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => setHoveredMainBenefitIndex(index)}
              onMouseLeave={() => setHoveredMainBenefitIndex(null)}
              className={cn(
                "group",
                hoveredMainBenefitIndex !== null && hoveredMainBenefitIndex !== index && "blur-sm scale-[0.98]"
              )}
            >
              <Card className="card-hover border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <motion.div
                    className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <benefit.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <Badge
                    variant="secondary"
                    className="mb-3 bg-primary/10 text-primary"
                  >
                    {benefit.stat}
                  </Badge>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <div className="bg-muted/30 rounded-3xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">
            Traditional Legal Services vs Justicaa
          </h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
              {comparisonData.map((item, index) => (
                <div
                  key={index}
                  className="bg-background rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                >
                  <div className="font-medium text-foreground">
                    {item.aspect}
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      Traditional
                    </div>
                    <div className="text-destructive font-medium">
                      {item.traditional}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      Justicaa
                    </div>
                    <div className="text-primary font-medium">
                      {item.justicaa}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Benefits */}
        <div>
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">
            Additional Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                onMouseEnter={() => setHoveredAdditionalBenefitIndex(index)}
                onMouseLeave={() => setHoveredAdditionalBenefitIndex(null)}
                className={cn(
                  "text-center group",
                  hoveredAdditionalBenefitIndex !== null && hoveredAdditionalBenefitIndex !== index && "blur-sm scale-[0.98]"
                )}
              >
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  {benefit.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};