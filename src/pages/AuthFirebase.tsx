import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, signInWithGoogle } from "@/integrations/firebase/auth";
import { createProfile, createVendorProfile } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Briefcase, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import Logo from "@/components/Logo";
import ErrorBoundary from "@/components/ErrorBoundary";

type UserRole = "gig_worker" | "vendor";

const AuthFirebase = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;

      if (user) {
        // Get user role from Firestore
        const { getUserByEmail } = await import("@/integrations/firebase/firestore");
        const userData = await getUserByEmail(user.email!);
        
        if (userData) {
          // Check if user has a profile, if not create one
          const { getProfile, getVendorProfile } = await import("@/integrations/firebase/firestore");
          const profile = await getProfile(user.uid);
          const vendorProfile = await getVendorProfile(user.uid);
          
          if (!profile && !vendorProfile) {
            // First time Google sign-in, create default profile
            if (userData.role === "gig_worker") {
              await createProfile({
                userId: user.uid,
                fullName: user.displayName || user.email!.split('@')[0],
                rating: 0,
                totalJobsCompleted: 0,
                expectedPayPerHour: 0,
                experienceLevel: "Beginner"
              });
            } else {
              await createVendorProfile({
                userId: user.uid,
                fullName: user.displayName || user.email!.split('@')[0],
                companyName: user.displayName || user.email!.split('@')[0]
              });
            }
          }
          
          toast.success("Signed in successfully!");
          navigate(userData.role === "gig_worker" ? "/worker/dashboard" : "/vendor/dashboard", { replace: true });
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Form submitted, isSignUp:", isSignUp, "selectedRole:", selectedRole);
      
      if (isSignUp) {
        if (!selectedRole) {
          console.log("No role selected, showing error");
          toast.error("Please select your role");
          setLoading(false);
          return;
        }

        console.log("Starting signup process for role:", selectedRole);
        const userCredential = await signUp(email, password, selectedRole, fullName);
        const user = userCredential.user;
        console.log("Signup successful, user created:", user.uid);

        if (user) {
          try {
            // Create appropriate profile
            if (selectedRole === "gig_worker") {
              console.log("Creating gig worker profile for:", user.uid);
              await createProfile({
                userId: user.uid,
                fullName: fullName,
                rating: 0,
                totalJobsCompleted: 0,
                expectedPayPerHour: 0,
                experienceLevel: "Beginner"
              });
              console.log("Gig worker profile created successfully");
            } else if (selectedRole === "vendor") {
              console.log("Creating vendor profile for:", user.uid);
              const vendorProfileId = await createVendorProfile({
                userId: user.uid,
                fullName: fullName,
                companyName: fullName
              });
              console.log("Vendor profile created successfully with ID:", vendorProfileId);
            }

            toast.success("Account created successfully!");
            navigate(selectedRole === "gig_worker" ? "/worker/dashboard" : "/vendor/dashboard", { replace: true });
          } catch (profileError: any) {
            console.error("Error creating profile:", profileError);
            toast.error(`Profile creation failed: ${profileError.message}`);
            // Still navigate to dashboard - the profile creation will be handled there
            navigate(selectedRole === "gig_worker" ? "/worker/dashboard" : "/vendor/dashboard", { replace: true });
          }
        }
      } else {
        const userCredential = await signIn(email, password);
        const user = userCredential.user;

        if (user) {
          // Get user role from Firestore
          const { getUserByEmail } = await import("@/integrations/firebase/firestore");
          const userData = await getUserByEmail(user.email!);
          
          if (userData) {
            toast.success("Signed in successfully!");
            navigate(userData.role === "gig_worker" ? "/worker/dashboard" : "/vendor/dashboard", { replace: true });
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <Navigation 
          showLogoutButton={false} 
          showSettingsButton={false}
          showPostJobButton={false}
        />

      {/* Auth Content */}
      <div className="flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? "Choose your role to get started" : "Sign in to your account"}
          </CardDescription>
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-muted-foreground text-center mt-2">
              Debug: isSignUp={isSignUp.toString()}, selectedRole={selectedRole || 'none'}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isSignUp && !selectedRole && (
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary"
                onClick={() => {
                  console.log("Gig worker button clicked");
                  setSelectedRole("gig_worker");
                  console.log("Selected role set to gig_worker");
                }}
              >
                <User className="h-8 w-8" />
                <span className="font-semibold">I'm a Gig Worker</span>
                <span className="text-xs text-muted-foreground">Find work opportunities</span>
              </Button>
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-secondary/10 hover:border-secondary"
                onClick={() => {
                  console.log("Vendor button clicked");
                  setSelectedRole("vendor");
                  console.log("Selected role set to vendor");
                }}
              >
                <Briefcase className="h-8 w-8" />
                <span className="font-semibold">I'm a Vendor</span>
                <span className="text-xs text-muted-foreground">Hire talented workers</span>
              </Button>
            </div>
          )}

          {(!isSignUp || selectedRole) && (
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && selectedRole && (
                <div className="flex justify-center mb-4">
                  <Badge 
                    variant="secondary" 
                    className={selectedRole === "gig_worker" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-secondary/10 text-secondary"
                    }
                  >
                    {selectedRole === "gig_worker" ? "Gig Worker Account" : "Employer Account"}
                  </Badge>
                </div>
              )}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
              </Button>
            </form>
          )}

          {/* Google Sign-In Section */}
          {!isSignUp && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {loading ? "Please wait..." : "Continue with Google"}
              </Button>
            </>
          )}

          <div className="mt-4 text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setSelectedRole(null);
              }}
              className="text-primary hover:underline font-semibold"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default AuthFirebase;
