import { Badge } from "@/components/ui/badge";
import { InfiniteMovingCards } from "@/components/InfiniteMovingCards";

export const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "Justicaa helped me understand my consumer rights when dealing with a difficult vendor. The AI gave me clear guidance, and I was able to resolve the issue without hiring a lawyer. Saved me both time and money!",
      name: "Rahul Sharma",
      title: "Small Business Owner, Mumbai",
    },
    {
      quote:
        "I needed to draft a rental agreement urgently. Justicaa's document generator created a comprehensive, legally sound agreement in minutes. The lawyer I consulted later confirmed it was perfect!",
      name: "Priya Singh",
      title: "Software Engineer, Bangalore",
    },
    {
      quote:
        "The platform helped me understand medical malpractice laws and how to protect my practice. The AI explanations were clear, and when I needed deeper consultation, they connected me with a specialist lawyer.",
      name: "Dr. Amit Patel",
      title: "Doctor, Ahmedabad",
    },
    {
      quote:
        "When my neighbor was causing property disputes, I didn't know my rights. Justicaa explained everything in simple Hindi and guided me through the legal process. Very helpful and easy to understand!",
      name: "Sunita Devi",
      title: "Homemaker, Jaipur",
    },
    {
      quote:
        "Starting a business requires understanding so many laws. Justicaa became my legal advisor - from company registration to employment laws. The AI guidance was accurate and the lawyer referrals were excellent.",
      name: "Vikash Kumar",
      title: "Startup Founder, Delhi",
    },
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            What Our Clients Say
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trusted by Professionals and Individuals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real stories from people who found clarity and solutions with
            Justicaa.
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </section>
  );
};