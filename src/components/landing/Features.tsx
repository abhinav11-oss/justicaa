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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
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
      </motion.div>

      {/* Main Features with Images */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {mainFeatures.map((feature, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="card-hover border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm h-full overflow-hidden">
              {/* Feature Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={
                    index === 0
                      ? "https://images.pexels.com/photos/8112172/pexels-photo-8112172.jpeg"
                      : index === 1
                        ? "https://images.pexels.com/photos/5816291/pexels-photo-5816291.jpeg"
                        : "https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg"
                  }
                  alt={`${feature.title} illustration`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <CardHeader className="pb-4">
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
          </motion.div>
        ))}
      </motion.div>

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
