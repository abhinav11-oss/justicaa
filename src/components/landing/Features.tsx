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
    <section id="features" className="relative py-20 overflow-hidden">
      {/* Background with Fade Gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-l from-primary/8 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2 bg-primary/5 border-primary/20"
            >
              Features
            </Badge>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ rotateX: -90, opacity: 0 }}
            whileInView={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Comprehensive Legal Solutions
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            Everything you need to handle your legal matters efficiently, from
            AI consultations to expert lawyer connections
          </motion.p>
        </motion.div>

        {/* Main Features with Enhanced Animations */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={{ rotateY: -90, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 },
              }}
            >
              <Card className="card-hover border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm h-full overflow-hidden relative group">
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Feature Image with Enhanced Effects */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={
                      index === 0
                        ? "https://images.pexels.com/photos/8112172/pexels-photo-8112172.jpeg"
                        : index === 1
                          ? "https://images.pexels.com/photos/5816291/pexels-photo-5816291.jpeg"
                          : "https://images.pexels.com/photos/4427430/pexels-photo-4427430.jpeg"
                    }
                    alt={`${feature.title} illustration`}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  {/* Multiple Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Animated Icon */}
                  <motion.div
                    className="absolute bottom-4 left-4"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <feature.icon className="h-6 w-6 text-white relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{
                          x: [-100, 100],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5,
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                <CardHeader className="pb-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Badge
                      variant="secondary"
                      className="mb-3 bg-primary/10 text-primary text-sm w-fit"
                    >
                      {feature.highlight}
                    </Badge>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <motion.ul
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {feature.benefits.map((benefit, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 + idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="w-1.5 h-1.5 bg-primary rounded-full mr-2"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.2,
                          }}
                        />
                        {benefit}
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features Grid with Fade Animation */}
        <motion.div
          className="bg-gradient-to-br from-muted/30 via-muted/20 to-primary/5 rounded-3xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>

          <div className="text-center mb-12 relative z-10">
            <motion.h3
              className="text-2xl font-bold text-foreground mb-2"
              initial={{ rotateX: -90, opacity: 0 }}
              whileInView={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Additional Legal Services
            </motion.h3>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              More tools to support your legal journey
            </motion.p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {additionalFeatures.slice(0, 6).map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
                initial={{ rotateX: -45, opacity: 0 }}
                whileInView={{ rotateX: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 card-hover border border-border/50 relative overflow-hidden">
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <motion.div
                    className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h4 className="font-semibold text-foreground mb-2 relative z-10">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground relative z-10">
                    {feature.description}
                  </p>

                  {/* Animated Shimmer Effect */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                    animate={{ x: [-100, 100] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
