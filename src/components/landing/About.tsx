import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, useInView, useAnimation, animate } from "framer-motion";
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
import { cn } from "@/lib/utils";
import React from "react";

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 20,
        },
      });
      const animation = animate(0, value, {
        duration: 2,
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest));
        },
      });
      return () => animation.stop();
    }
  }, [inView, value, controls]);

  return (
    <motion.span ref={ref} initial={{ opacity: 0, y: 20 }} animate={controls}>
      {displayValue.toLocaleString()}+
    </motion.span>
  );
};

export const About = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = [
    {
      number: 50000,
      label: "Legal Questions Answered",
      icon: MessageSquare,
    },
    { number: 1000, label: "Legal Documents Generated", icon: BookOpen },
    { number: 500, label: "Verified Lawyers", icon: Users },
    { number: 24, label: "Support Available", text: "24/7", icon: Shield },
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
    <section id="about" className="relative py-20 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-2 bg-primary/5 border-primary/20 text-primary"
          >
            About Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Revolutionizing Legal Access in India
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bridging the gap between complex legal systems and everyday citizens
            through innovative AI technology
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="text-center bg-card border-transparent card-hover">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-4xl font-bold text-foreground mb-1">
                    {stat.text ? stat.text : <AnimatedNumber value={stat.number} />}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main About Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
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
                  By combining cutting-edge AI with deep knowledge of
                  Indian laws, we've created a platform that makes legal
                  assistance as simple as having a conversation.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Card className="bg-background/80 backdrop-blur-sm border-0 shadow-lg card-glow">
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
                    A multidisciplinary team dedicated to making legal help accessible
                    to every Indian citizen.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Values Section */}
          <div>
            <h3 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                >
                  <Card className="text-center bg-card border-transparent hover:shadow-lg transition-shadow h-full p-6">
                    <div className="gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-3 text-lg">
                      {value.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};