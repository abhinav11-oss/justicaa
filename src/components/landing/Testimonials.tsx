import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

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
        "Starting a business requires understanding so many laws. Justicaa became my legal advisor - from company registration to employment laws. The AI guidance was accurate and the lawyer referrals were excellent.",
      name: "Vikash Kumar",
      title: "Startup Founder, Delhi",
    },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 testimonial-glass-container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-gray-500 text-gray-300">
            What Our Clients Say
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Professionals and Individuals
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real stories from people who found clarity and solutions with
            Justicaa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-glass-box h-full">
                <span className="title">
                  <Quote className="h-8 w-8 opacity-50" />
                </span>
                <div>
                  <div className="flex items-center text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="mb-4 flex-grow">{testimonial.quote}</p>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.title}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};