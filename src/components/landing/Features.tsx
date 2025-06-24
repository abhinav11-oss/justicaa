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
        staggerChildren: 0.1, // Reduced stagger
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Reduced y translation
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }, // Reduced duration
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
      {/* Background with Fade Gradients (simplified) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-2xl"></div> {/* Reduced size and blur */}
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-gradient-to-l from-primary/8 to-transparent rounded-full blur-xl"></div> {/* Reduced size and blur */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} // Reduced y translation
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} // Reduced duration
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} // Simplified animation
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.3 }} // Reduced delay, adjusted bounce
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
            initial={{ opacity: 0, y: 30 }} // Simplified animation
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Comprehensive Legal Solutions
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }} // Reduced y translation
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }} // Reduced duration
            viewport={{ once: true }}
          >
            Everything you need to handle your legal matters efficiently, from
            AI consultations to expert lawyer connections
          </motion.p>
        </motion.div>

        {/* Main Features with Enhanced Animations (simplified) */}
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
              initial={{ opacity: 0, y: 20 }} // Simplified animation
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5, // Reduced duration
                delay: index * 0.1, // Reduced delay
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.02, // Reduced scale
              }}
            >
              <Card className="card-hover border-2 hover:border-primary/20 bg-card/50 backdrop-blur-sm h-full overflow-hidden relative group">
                {/* Animated Background Gradient (simplified) */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Feature Image with Enhanced Effects (simplified) */}
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
                    whileHover={{ scale: 1.05 }} // Reduced scale
                    transition={{ duration: 0.3 }} // Reduced duration
                  />
                  {/* Multiple Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Animated Icon (simplified) */}
                  <motion.div
                    className="absolute bottom-4 left-4"
                    whileHover={{ scale: 1.1 }} // Reduced scale, removed rotate
                    transition={{ type: "spring", stiffness: 300 }} // Adjusted stiffness
                  >
                    <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <feature.icon className="h-6 w-6 text-white relative z-10" />
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{
                          x: [-50, 50], // Reduced x range
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5, // Reduced duration
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.3, // Reduced delay
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                <CardHeader className="pb-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }} // Reduced x translation
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }} // Reduced delay
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
                    initial={{ opacity: 0, y: 10 }} // Reduced y translation
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }} // Reduced delay
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
                    transition={{ delay: 0.5 + index * 0.1 }} // Reduced delay
                    viewport={{ once: true }}
                  >
                    {feature.benefits.map((benefit, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center text-sm text-muted-foreground"
                        initial={{ opacity: 0, x: -5 }} // Reduced x translation
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 + idx * 0.05 }} // Reduced delay
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="w-1.5 h-1.5 bg-primary rounded-full mr-2"
                          animate={{ scale: [1, 1.2, 1] }} // Reduced scale
                          transition={{
                            duration: 1.5, // Reduced duration
                            repeat: Infinity,
                            delay: idx * 0.1, // Reduced delay
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

        {/* Additional Features Grid with Fade Animation (simplified) */}
        <motion.div
          className="bg-gradient-to-br from-muted/30 via-muted/20 to-primary/5 rounded-3xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }} // Reduced y translation
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} // Reduced duration
          viewport={{ once: true }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>

          <div className="text-center mb-12 relative z-10">
            <motion.h3
              className="text-2xl font-bold text-foreground mb-2"
              initial={{ opacity: 0, y: 20 }} // Simplified animation
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }} // Reduced duration
              viewport={{ once: true }}
            >
              Additional Legal Services
            </motion.h3>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }} // Reduced y translation
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }} // Reduced delay
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
                initial={{ opacity: 0, y: 20 }} // Simplified animation
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4, // Reduced duration
                  delay: index * 0.08, // Reduced delay
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01, y: -3 }} // Reduced hover effect
              >
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 card-hover border border-border/50 relative overflow-hidden">
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <motion.div
                    className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10"
                    whileHover={{ scale: 1.05 }} // Reduced scale, removed rotate
                    transition={{ duration: 0.3 }} // Reduced duration
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h4 className="font-semibold text-foreground mb-2 relative z-10">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground relative z-10">
                    {feature.description}
                  </p>

                  {/* Animated Shimmer Effect (simplified) */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" // Reduced opacity
                    animate={{ x: [-50, 150] }} // Reduced x range
                    transition={{
                      duration: 2, // Reduced duration
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2, // Reduced delay
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