import { motion } from "framer-motion";
import { Scale, Phone, Mail, MapPin, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-card border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="gradient-primary p-2 rounded-xl">
                <Scale className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">
                Justicaa
              </span>
            </div>
            <p className="text-muted-foreground mb-4 text-base">
              Empowering every Indian with accessible legal solutions through AI
              technology
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-foreground mb-4">Company</h5>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-foreground mb-4">Contact Us</h5>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <a
                  href="tel:+918269704727"
                  className="hover:text-foreground transition-colors"
                >
                  +91 8269704727
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:abhinavlodhi99@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  abhinavlodhi99@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <div className="text-sm text-muted-foreground">
            <strong>Legal Disclaimer:</strong> This platform provides general
            legal information only and is not a substitute for professional
            legal advice. For specific legal matters, please consult with a
            qualified attorney.
          </div>
        </div>
      </div>
    </footer>
  );
};
