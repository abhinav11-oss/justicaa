import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Users, Shield, Search, BookOpen } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "AI Legal Consultation",
      description:
        "Get instant, accurate legal advice through intelligent conversations based on Indian laws.",
    },
    {
      icon: FileText,
      title: "Document Generation",
      description:
        "Create professional legal documents instantly with our AI-powered templates.",
    },
    {
      icon: Users,
      title: "Lawyer Network",
      description:
        "Connect with verified legal professionals across India based on your specific needs.",
    },
    {
      icon: Shield,
      title: "Case Law Research",
      description:
        "Access comprehensive legal research with relevant case studies and precedents.",
    },
    {
      icon: Search,
      title: "Legal Compliance Check",
      description:
        "Ensure your business or personal affairs comply with current Indian regulations.",
    },
    {
      icon: BookOpen,
      title: "Legal Education Hub",
      description:
        "Learn about your rights and legal procedures through our comprehensive guides.",
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
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="features" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4 px-4 py-2 text-primary border-primary/30">
            Our Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            A Complete Legal Toolkit
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Justicaa offers a suite of powerful tools to handle all your legal
            needs efficiently and affordably.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full bg-card border-transparent hover:border-primary/20 transition-colors duration-300 group card-hover">
                <CardHeader>
                  <motion.div
                    className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                  </motion.div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};