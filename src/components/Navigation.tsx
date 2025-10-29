import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, LogOut, Settings, Plus, User, Info, Briefcase, Users } from "lucide-react";
import { signOutUser } from "@/integrations/firebase/auth";
import { toast } from "sonner";
import Logo from "@/components/Logo";

interface NavigationProps {
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showLogoutButton?: boolean;
  showSettingsButton?: boolean;
  showPostJobButton?: boolean;
  showProfileButton?: boolean;
  showAboutButton?: boolean;
  showExploreJobsButton?: boolean;
  showExploreApplicationsButton?: boolean;
  backPath?: string;
  settingsPath?: string;
  profilePath?: string;
  className?: string;
}

const Navigation = ({
  showBackButton = true,
  showHomeButton = true,
  showLogoutButton = false,
  showSettingsButton = false,
  showPostJobButton = false,
  showProfileButton = false,
  showAboutButton = true,
  showExploreJobsButton = false,
  showExploreApplicationsButton = false,
  backPath,
  settingsPath,
  profilePath,
  className = ""
}: NavigationProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  return (
    <header className={`border-b bg-card shadow-sm sticky top-0 z-50 w-full ${className}`}>
      <div className="w-full px-4 py-4 flex justify-between items-center">
        {/* Left side - Logo and main navigation */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <Logo size="md" />
          
          {/* Main Navigation - Home and About Us */}
          <div className="hidden md:flex gap-2">
            {showHomeButton && (
              <Button variant="ghost" onClick={() => navigate("/")}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            )}
            
            {showAboutButton && (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/about")}
              >
                <Info className="h-4 w-4 mr-2" />
                About Us
              </Button>
            )}
          </div>
        </div>

        {/* Right side - Profile and other actions */}
        <div className="flex gap-2">
          {showBackButton && (
            <Button 
              variant="outline" 
              onClick={() => backPath ? navigate(backPath) : navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
                 {showPostJobButton && (
                   <Button onClick={() => navigate("/vendor/post-job")}>
                     <Plus className="h-4 w-4 mr-2" />
                     Post Job
                   </Button>
                 )}

                 {showExploreJobsButton && (
                   <Button
                     variant="outline"
                     onClick={() => navigate("/worker/explore-jobs")}
                   >
                     <Briefcase className="h-4 w-4 mr-2" />
                     Explore Jobs
                   </Button>
                 )}

                 {showExploreApplicationsButton && (
                   <Button
                     variant="outline"
                     onClick={() => navigate("/vendor/explore-applications")}
                   >
                     <Users className="h-4 w-4 mr-2" />
                     Applications
                   </Button>
                 )}

                 {showSettingsButton && (
                   <Button
                     variant="outline"
                     onClick={() => navigate(settingsPath || "/settings")}
                   >
                     <Settings className="h-4 w-4 mr-2" />
                     Settings
                   </Button>
                 )}

                 {showProfileButton && (
                   <Button
                     variant="outline"
                     onClick={() => navigate(profilePath || "/profile")}
                   >
                     <User className="h-4 w-4 mr-2" />
                     Profile
                   </Button>
                 )}
          
          {showLogoutButton && (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
