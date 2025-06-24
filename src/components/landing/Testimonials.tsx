import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
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
              <div className="text-3xl font-bold text-foreground mb-2">4.8/5</div> {/* Changed text-primary to text-foreground */}
              <div className="text-sm text-muted-foreground">
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2"> {/* Changed text-primary to text-foreground */}
                50,000+
              </div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">95%</div> {/* Changed text-primary to text-foreground */}
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-2">24hrs</div> {/* Changed text-primary to text-foreground */}
              <div className="text-sm text-muted-foreground">
                Avg Response Time
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="card-hover bg-card border-border shadow-sm"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  <Quote className="h-5 w-5 text-primary-foreground" /> {/* Changed text-primary to text-primary-foreground */}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Case Badge */}
                <Badge
                  variant="secondary"
                  className="mb-4 bg-primary/10 text-primary-foreground text-xs" {/* Changed text-primary to text-primary-foreground */}
                >
                  {testimonial.case}
                </Badge>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="border-t border-border pt-4">
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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