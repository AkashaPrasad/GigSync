import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn } from "@/integrations/firebase/auth";
import { createProfile, createVendorProfile } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Briefcase, User } from "lucide-react";

type UserRole = "gig_worker" | "vendor";

const AuthFirebase = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!selectedRole) {
          toast.error("Please select your role");
          setLoading(false);
          return;
        }

        const userCredential = await signUp(email, password, selectedRole, fullName);
        const user = userCredential.user;

        if (user) {
          // Create appropriate profile
          if (selectedRole === "gig_worker") {
            await createProfile({
              userId: user.uid,
              fullName: fullName,
              rating: 0,
              totalJobsCompleted: 0,
              expectedPayPerHour: 0,
              experienceLevel: "Beginner"
            });
          } else if (selectedRole === "vendor") {
            await createVendorProfile({
              userId: user.uid,
              fullName: fullName,
              companyName: fullName
            });
          }

          toast.success("Account created successfully!");
          navigate(selectedRole === "gig_worker" ? "/worker/dashboard" : "/vendor/dashboard", { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? "Create an account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp ? "Choose your role to get started" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignUp && !selectedRole && (
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary"
                onClick={() => setSelectedRole("gig_worker")}
              >
                <User className="h-8 w-8" />
                <span className="font-semibold">I'm a Gig Worker</span>
                <span className="text-xs text-muted-foreground">Find work opportunities</span>
              </Button>
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-secondary/10 hover:border-secondary"
                onClick={() => setSelectedRole("vendor")}
              >
                <Briefcase className="h-8 w-8" />
                <span className="font-semibold">I'm a Vendor</span>
                <span className="text-xs text-muted-foreground">Hire talented workers</span>
              </Button>
            </div>
          )}

          {(!isSignUp || selectedRole) && (
            <form onSubmit={handleAuth} className="space-y-4">
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
  );
};

export default AuthFirebase;
