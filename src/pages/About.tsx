import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, TrendingUp, Shield, Clock, DollarSign, Heart, Target, Zap, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import Logo from "@/components/Logo";

const About = () => {
  const stats = [
    { label: "Active Gig Workers", value: "2.5M+", icon: Users },
    { label: "Average Rating", value: "4.8/5", icon: TrendingUp },
    { label: "Countries Served", value: "25+", icon: Globe }
  ];

  const values = [
    {
      icon: Heart,
      title: "Empowering Workers",
      description: "We believe every gig worker deserves fair pay, respect, and opportunities to grow their skills and career."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Your safety and security are our top priorities. We verify all jobs and provide support when you need it."
    },
    {
      icon: DollarSign,
      title: "Fair Compensation",
      description: "We ensure transparent pricing and fair wages for all work completed through our platform."
    },
    {
      icon: Clock,
      title: "Flexible Work",
      description: "Work on your own schedule, choose projects that interest you, and maintain work-life balance."
    },
    {
      icon: Target,
      title: "Skill Development",
      description: "Access training resources and opportunities to develop new skills and advance your career."
    },
    {
      icon: Zap,
      title: "Quick Access",
      description: "Find and apply to jobs instantly, get matched with opportunities that fit your skills and availability."
    }
  ];

  const impact = [
    {
      title: "Economic Impact",
      description: "Gig workers contribute over ₹100 lakh crores to the global economy annually, providing essential services and driving innovation across industries.",
      highlight: "₹100L+ Cr"
    },
    {
      title: "Job Creation",
      description: "The gig economy has created millions of new employment opportunities, especially for those seeking flexible work arrangements.",
      highlight: "50M+ Jobs"
    },
    {
      title: "Skill Development",
      description: "Gig work provides opportunities for continuous learning and skill development, keeping workers competitive in the modern economy.",
      highlight: "85% Growth"
    },
    {
      title: "Workforce Diversity",
      description: "Gig work enables participation from diverse backgrounds, including students, parents, retirees, and those with disabilities.",
      highlight: "40% Diverse"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        showLogoutButton={false}
        showSettingsButton={false}
        showPostJobButton={false}
        showProfileButton={false}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About GigSync
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're on a mission to revolutionize the gig economy by connecting talented workers 
              with meaningful opportunities while championing the importance of gig work in our modern society.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Global Platform
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                Fair & Transparent
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Gig Workers Matter */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Why Gig Workers Matter
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Gig workers are the backbone of the modern economy, providing essential services 
              and driving innovation across every industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <value.icon className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              The Impact of Gig Work
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Gig work isn't just a trend—it's a fundamental shift in how we work, 
              learn, and contribute to society.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {impact.map((item, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                    <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                      {item.highlight}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-8">
              Our Mission
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                At GigSync, we believe that gig workers are not just contractors—they're entrepreneurs, 
                innovators, and essential contributors to our economy. We're building a platform that 
                recognizes and celebrates the value of flexible work.
              </p>
              <p>
                Our mission is to create a fair, transparent, and supportive ecosystem where gig workers 
                can thrive, grow their skills, and build sustainable careers. We're committed to:
              </p>
              <ul className="text-left max-w-2xl mx-auto space-y-3">
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Ensuring fair compensation and transparent pricing
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Providing safety and security measures for all workers
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Offering opportunities for skill development and career growth
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Building a community that supports and uplifts gig workers
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3">•</span>
                  Advocating for gig worker rights and recognition
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Join the Gig Revolution
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're a gig worker looking for opportunities or a business seeking talent, 
            GigSync is your gateway to the future of work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started as Worker
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 text-white border-white hover:bg-white hover:text-primary">
              Post a Job
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 GigSync. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Empowering gig workers, one opportunity at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
