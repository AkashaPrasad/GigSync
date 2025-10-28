import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, CheckCircle2, MapPin, Star, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session) {
          // Check user role and redirect
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();

          if (roleData?.role === "gig_worker") {
            navigate("/worker/dashboard", { replace: true });
          } else if (roleData?.role === "vendor") {
            navigate("/vendor/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // Check user role and redirect when auth state changes
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data?.role === "gig_worker") {
              navigate("/worker/dashboard", { replace: true });
            } else if (data?.role === "vendor") {
              navigate("/vendor/dashboard", { replace: true });
            }
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const features = [
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Verified Workers",
      description: "Connect with skilled gig workers verified through secure digital credentials",
    },
    {
      icon: <Briefcase className="h-12 w-12 text-secondary" />,
      title: "Quality Jobs",
      description: "Find meaningful work opportunities matched to your skills and availability",
    },
    {
      icon: <Star className="h-12 w-12 text-warning" />,
      title: "Rating System",
      description: "Build trust through transparent ratings and verified work history",
    },
    {
      icon: <CheckCircle2 className="h-12 w-12 text-success" />,
      title: "Smart Matching",
      description: "AI-powered matching algorithm connects the right workers with the right jobs",
    },
  ];

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white">
              <Badge variant="secondary" className="w-fit">
                Connecting Workers & Employers
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Find Work. <br />
                Hire Talent. <br />
                <span className="text-secondary">Build Success.</span>
              </h1>
              <p className="text-lg lg:text-xl text-white/90">
                The modern platform connecting skilled gig workers with quality job opportunities.
                Sign up today and experience seamless hiring or finding your next gig.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 bg-white/10 text-white border-white hover:bg-white hover:text-primary"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src={heroImage}
                alt="Diverse gig workers"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Why Choose GigConnect?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A platform built for the modern workforce with features that matter
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader className="space-y-4">
                  <div className="w-fit p-3 bg-gradient-card rounded-lg">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">1000+</div>
              <p className="text-xl text-muted-foreground">Active Workers</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">500+</div>
              <p className="text-xl text-muted-foreground">Jobs Posted</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-success mb-2">95%</div>
              <p className="text-xl text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of workers and employers building successful partnerships
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/auth")}
            className="text-lg px-12"
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 GigConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
