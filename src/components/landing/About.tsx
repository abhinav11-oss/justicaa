
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Users, Gavel, MessageSquare } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <Badge variant="outline" className="mb-4">About Us</Badge>
        <h3 className="text-4xl font-bold text-foreground mb-4">Meet Team Ctrl+Alt+Elite</h3>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Passionate developers revolutionizing legal accessibility through AI technology
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card className="card-hover border-2 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scale className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl mb-2">Justicaa</CardTitle>
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
              AI Legal Platform
            </Badge>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Justicaa is an innovative AI-powered legal assistance platform designed specifically for the Indian legal system. 
              Our mission is to democratize legal knowledge and make quality legal guidance accessible to every Indian citizen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Our Team</h4>
                <p className="text-sm text-muted-foreground">Ctrl+Alt+Elite</p>
              </div>
              
              <div className="text-center">
                <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Gavel className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Focus</h4>
                <p className="text-sm text-muted-foreground">Indian Legal System</p>
              </div>
              
              <div className="text-center">
                <div className="gradient-primary w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Mission</h4>
                <p className="text-sm text-muted-foreground">Accessible Legal AI</p>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 mt-8">
              <p className="text-muted-foreground">
                We believe that legal knowledge should not be a privilege of the few, but a right accessible to all. 
                Through cutting-edge AI technology and deep understanding of Indian laws, we're building a platform 
                that empowers citizens with instant, accurate, and affordable legal guidance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
