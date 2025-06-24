import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility
import { InfiniteMovingCards } from "@/components/InfiniteMovingCards"; // Import the new component

export const Testimonials = () => {
  const [hoveredTestimonialIndex, setHoveredTestimonialIndex] = useState<number | null>(null);

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Small Business Owner",
      location: "Mumbai, Maharashtra",
      content:
        "Justicaa helped me understand my consumer rights when dealing with a difficult vendor. The AI gave me clear guidance, and I was able to resolve the issue without hiring a lawyer. Saved me both time and money!",
      rating: 5,
      case: "Consumer Protection",
    },
    {
      name: "Priya Singh",
      role: "Software Engineer",
      location: "Bangalore, Karnataka",
      content:
        "I needed to draft a rental agreement urgently. Justicaa's document generator created a comprehensive, legally sound agreement in minutes. The lawyer I consulted later confirmed it was perfect!",
      rating: 5,
      case: "Document Generation",
    },
    {
      name: "Dr. Amit Patel",
      role: "Doctor",
      location: "Ahmedabad, Gujarat",
      content:
        "The platform helped me understand medical malpractice laws and how to protect my practice. The AI explanations were clear, and when I needed deeper consultation, they connected me with a specialist lawyer.",
      rating: 5,
      case: "Professional Consultation",
    },
    {
      name: "Sunita Devi",
      role: "Homemaker",
      location: "Jaipur, Rajasthan",
      content:
        "When my neighbor was causing property disputes, I didn't know my rights. Justicaa explained everything in simple Hindi and guided me through the legal process. Very helpful and easy to understand!",
      rating: 5,
      case: "Property Rights",
    },
    {
      name: "Vikash Kumar",
      role: "Startup Founder",
      location: "Delhi, NCR",
      content:
        "Starting a business requires understanding so many laws. Justicaa became my legal advisor - from company registration to employment laws. The AI guidance was accurate and the lawyer referrals were excellent.",
      rating: 5,
      case: "Business Law",
    },
    {
      name: "Meera Krishnan",
      role: "Working Professional",
      location: "Chennai, Tamil Nadu",
      content:
        "Had a workplace harassment issue and didn't know how to proceed. Justicaa provided detailed guidance on labor laws and connected me with a women's rights lawyer. Couldn't have navigated this alone.",
      rating: 5,
      case: "Employment Law",
    },
  ];

  // Adapt testimonials for InfiniteMovingCards component
  const infiniteMovingCardsItems = testimonials.map(t => ({
    quote: `"${t.content}"`,
    name: t.name,
    title: `${t.role}, ${t.location}`
  }));

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trusted by Thousands Across India
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from real people who found legal solutions through
            Justicaa
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                50,000+
              </div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24hrs</div>
              <div className="text-sm text-muted-foreground">
                Avg Response Time
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid - Now using InfiniteMovingCards */}
        <div className="h-[20rem] relative flex flex-col items-center justify-center overflow-hidden rounded-md antialiased bg-background dark:bg-black dark:bg-grid-white/[0.05] relative overflow-hidden">
          <InfiniteMovingCards
            items={infiniteMovingCardsItems}
            direction="right"
            speed="slow"
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Join thousands of satisfied users who have resolved their legal
            matters with Justicaa
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span>4.8/5 rating</span>
            </div>
            <div>•</div>
            <div>50,000+ users served</div>
            <div>•</div>
            <div>Available in 10+ languages</div>
          </div>
        </div>
      </div>
    </section>
  );
};