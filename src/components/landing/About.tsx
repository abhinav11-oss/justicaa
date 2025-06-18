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
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            About Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Revolutionizing Legal Access in India
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bridging the gap between complex legal systems and everyday citizens
            through innovative AI technology
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center bg-background border-0 shadow-sm"
            >
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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

            <Card className="bg-background border-0 shadow-lg">
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
                  className="text-center bg-background border-0 shadow-sm card-hover"
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
