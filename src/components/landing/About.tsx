import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Scale,
  Users,
  Gavel,
  MessageSquare,
  Award,
  BookOpen,
  Shield,
  Target,
} from "lucide-react";

export const About = () => {
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

  const stats = [
    {
      number: "50,000+",
      label: "Legal Questions Answered",
      icon: MessageSquare,
    },
    { number: "1,000+", label: "Legal Documents Generated", icon: BookOpen },
    { number: "500+", label: "Verified Lawyers", icon: Users },
    { number: "24/7", label: "Support Available", icon: Shield },
  ];

  const values = [
    {
      icon: Scale,
      title: "Justice for All",
      description:
        "We believe legal help should be accessible to everyone, regardless of economic background",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Your legal matters are confidential and handled with the highest level of security",
    },
    {
      icon: Award,
      title: "Expert Quality",
      description:
        "AI trained on extensive legal databases and verified by legal professionals",
    },
    {
      icon: Target,
      title: "Results Focused",
      description:
        "We measure success by the legal problems we solve and lives we improve",
    },
  ];

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Background with Multiple Fade Gradients (simplified) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-primary/10"></div>
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-primary/8 to-transparent rounded-full blur-2xl"></div> {/* Reduced size and blur */}
        <div className="absolute bottom-1/4 right-0 w-56 h-56 bg-gradient-to-l from-primary/6 to-transparent rounded-full blur-xl"></div> {/* Reduced size and blur */}
        <div className="absolute top-0 right-1/3 w-48 h-48 bg-gradient-to-br from-primary/4 to-transparent rounded-full blur-lg"></div> {/* Reduced size and blur */}
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
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }} // Reduced duration, adjusted bounce
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-4 px-4 py-2 bg-primary/5 border-primary/20"
            >
              About Us
            </Badge>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 30 }} // Simplified animation
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Revolutionizing Legal Access in India
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }} // Reduced y translation
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }} // Reduced duration
            viewport={{ once: true }}
          >
            Bridging the gap between complex legal systems and everyday citizens
            through innovative AI technology
          </motion.p>
        </motion.div>

        {/* Stats Section with Rolling Animation (simplified) */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }} // Simplified animation
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5, // Reduced duration
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }} // Reduced hover scale, removed rotateY
            >
              <Card className="text-center bg-card/80 backdrop-blur-sm border border-border shadow-sm card-hover relative overflow-hidden group">
                {/* Animated Background (simplified) */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <CardContent className="pt-6 relative z-10">
                  <motion.div
                    className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 relative overflow-hidden"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <stat.icon className="h-6 w-6 text-primary relative z-10" />
                    <motion.div
                      className="absolute inset-0 bg-primary/20"
                      animate={{ opacity: [0.3, 0.6, 0.3] }} // Simplified animation
                      transition={{
                        duration: 2, // Reduced duration
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3, // Reduced delay
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="text-3xl font-bold text-foreground mb-1"
                    initial={{ scale: 0.8, opacity: 0 }} // Simplified animation
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: 0.3 + index * 0.1, // Reduced delay
                      type: "spring",
                      bounce: 0.3, // Reduced bounce
                    }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>

                {/* Shimmer Effect (simplified) */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" // Reduced opacity
                  animate={{ x: [-50, 150] }} // Reduced x range
                  transition={{
                    duration: 2, // Reduced duration
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.5, // Reduced delay
                  }}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main About Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Our Story
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Justicaa was born from a simple observation: millions of
                  Indians struggle to access quality legal help due to high
                  costs, language barriers, and complex procedures. Our team of
                  passionate technologists and legal experts set out to change
                  this reality.
                </p>
                <p className="text-lg leading-relaxed">
                  By combining cutting-edge AI technology with deep knowledge of
                  Indian laws, we've created a platform that makes legal
                  assistance as simple as having a conversation. From rural
                  farmers to urban entrepreneurs, everyone deserves access to
                  justice.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, Justicaa serves thousands of users across India,
                  providing instant legal guidance, document generation, and
                  connections to qualified lawyers. We're not just building
                  software – we're building a more just society.
                </p>
              </div>
            </div>

            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="text-center">
                <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">
                  Team Ctrl+Alt+Elite
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary"
                >
                  Innovation in Legal Tech
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  A multidisciplinary team of software engineers, legal experts,
                  and AI researchers dedicated to making legal help accessible
                  to every Indian citizen.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">5+</div>
                    <div className="text-muted-foreground">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-muted-foreground">
                      Indian Laws Focus
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Values Section */}
          <div>
            <h3 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="text-center bg-card border-border shadow-sm card-hover"
                >
                  <CardContent className="pt-6">
                    <div className="gradient-primary w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-7 w-7 text-white" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3">
                      {value.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};