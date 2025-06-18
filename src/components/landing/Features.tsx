import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Users,
  Shield,
  Search,
  BookOpen,
  Gavel,
  Phone,
} from "lucide-react";

export const Features = () => {
  const mainFeatures = [
    {
      icon: MessageSquare,
      title: "AI Legal Consultation",
      description:
        "Get instant, accurate legal advice through intelligent conversations. Our AI understands complex legal scenarios and provides relevant guidance based on Indian laws.",
      highlight: "Instant Advice",
      benefits: [
        "24/7 availability",
        "Multilingual support",
        "Case precedent analysis",
      ],
    },
    {
      icon: FileText,
      title: "Legal Document Generator",
      description:
        "Create professional legal documents instantly with our AI-powered templates. From contracts to affidavits, generate legally sound documents in minutes.",
      highlight: "Smart Drafting",
      benefits: ["100+ templates", "Court-ready format", "Expert reviewed"],
    },
    {
      icon: Users,
      title: "Lawyer Network",
      description:
        "Connect with verified legal professionals across India. Get matched with specialists based on your case type, location, and budget requirements.",
      highlight: "Expert Matching",
      benefits: ["Verified lawyers", "Transparent pricing", "Local expertise"],
    },
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Case Law Research",
      description:
        "Access comprehensive legal research with relevant case studies and precedents",
    },
    {
      icon: Search,
      title: "Legal Compliance Check",
      description:
        "Ensure your business or personal affairs comply with current Indian regulations",
    },
    {
      icon: BookOpen,
      title: "Legal Education Hub",
      description:
        "Learn about your rights and legal procedures through our comprehensive guides",
    },
    {
      icon: Gavel,
      title: "Court Procedure Guide",
      description:
        "Step-by-step guidance for filing cases and navigating court procedures",
    },
    {
      icon: Phone,
      title: "Emergency Legal Help",
      description:
        "Urgent legal assistance for time-sensitive matters and emergency situations",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Features
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Comprehensive Legal Solutions
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to handle your legal matters efficiently, from AI
          consultations to expert lawyer connections
        </p>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {mainFeatures.map((feature, index) => (
          <Card
            key={index}
            className="card-hover border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm h-full"
          >
            <CardHeader className="pb-4">
              <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <Badge
                variant="secondary"
                className="mb-3 bg-primary/10 text-primary text-sm w-fit"
              >
                {feature.highlight}
              </Badge>
              <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Features Grid */}
      <div className="bg-muted/30 rounded-3xl p-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Additional Legal Services
          </h3>
          <p className="text-muted-foreground">
            More tools to support your legal journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.slice(0, 6).map((feature, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-6 card-hover"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
