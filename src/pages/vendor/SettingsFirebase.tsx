import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUserData } from "@/integrations/firebase/auth";
import { getVendorProfile, updateVendorProfile, createVendorProfile } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, User, Building2, Mail, Phone } from "lucide-react";
import Navigation from "@/components/Navigation";

const SettingsFirebase = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    bio: "",
    website: "",
    address: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const userData = await getCurrentUserData();
        if (userData && userData.role === "vendor") {
          await fetchProfile(user.uid);
        } else {
          navigate("/auth");
        }
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const profileData = await getVendorProfile(userId);
      
      if (!profileData) {
        // If no profile exists, create a new one with basic info
        console.log("No vendor profile found, creating new one");
        try {
          const newProfile = {
            userId: userId,
            fullName: userData?.fullName || "",
            companyName: userData?.fullName || "",
            email: userData?.email || "",
            phone: "",
            bio: "",
            website: "",
            address: "",
          };
          
          // Create the profile
          const profileId = await createVendorProfile(newProfile);
          console.log("Created new vendor profile with ID:", profileId);
          
          // Set the profile data
          setProfile({
            id: profileId,
            ...newProfile,
            createdAt: new Date() as any,
            updatedAt: new Date() as any
          });
          
          setFormData({
            fullName: newProfile.fullName,
            companyName: newProfile.companyName,
            email: newProfile.email,
            phone: newProfile.phone,
            bio: newProfile.bio,
            website: newProfile.website,
            address: newProfile.address,
          });
          
          toast.success("Welcome! Please complete your vendor profile.");
        } catch (createError: any) {
          console.error("Error creating vendor profile:", createError);
          toast.error("Failed to create vendor profile. Please try again.");
          // Set a temporary profile to prevent infinite loading
          const tempProfile = {
            id: "temp",
            userId: userId,
            fullName: userData?.fullName || "",
            companyName: userData?.fullName || "",
            email: userData?.email || "",
            phone: "",
            bio: "",
            website: "",
            address: "",
            createdAt: new Date() as any,
            updatedAt: new Date() as any
          };
          setProfile(tempProfile);
          setFormData({
            fullName: tempProfile.fullName,
            companyName: tempProfile.companyName,
            email: tempProfile.email,
            phone: tempProfile.phone,
            bio: tempProfile.bio,
            website: tempProfile.website,
            address: tempProfile.address,
          });
        }
      } else {
        setProfile(profileData);
        setFormData({
          fullName: profileData.fullName || "",
          companyName: profileData.companyName || "",
          email: userData?.email || "",
          phone: profileData.phone || "",
          bio: profileData.bio || "",
          website: profileData.website || "",
          address: profileData.address || "",
        });
      }
    } catch (error: any) {
      console.error("Error fetching vendor profile:", error);
      toast.error(error.message || "Failed to load vendor profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      await updateVendorProfile(profile.id, {
        fullName: formData.fullName,
        companyName: formData.companyName,
        phone: formData.phone,
        bio: formData.bio,
        website: formData.website,
        address: formData.address,
      });

      toast.success("Profile updated successfully!");
      navigate("/vendor/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        backPath="/vendor/dashboard"
        showLogoutButton={true}
        showSettingsButton={false}
        showProfileButton={false}
        showPostJobButton={true}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  Employer Account
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <CardDescription>
                Update your company details and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Enter your company name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your business address"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate("/vendor/dashboard")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsFirebase;
