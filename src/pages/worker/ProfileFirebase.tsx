import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUserData } from "@/integrations/firebase/auth";
import { getProfile, updateProfile } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { X } from "lucide-react";
import Navigation from "@/components/Navigation";

const WorkerProfileFirebase = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const userData = await getCurrentUserData();
        if (userData && userData.role === "gig_worker") {
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
      const profileData = await getProfile(userId);
      
      if (!profileData) {
        toast.error("Worker profile not found");
        navigate("/auth");
        return;
      }

      setProfile(profileData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!profile) {
        toast.error("Profile not found");
        return;
      }

      await updateProfile(profile.id, {
        fullName: profile.fullName,
        phone: profile.phone,
        bio: profile.bio,
        expectedPayPerHour: profile.expectedPayPerHour,
        experienceLevel: profile.experienceLevel,
      });

      toast.success("Profile updated successfully!");
      navigate("/worker/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills?.filter((s: string) => s !== skillToRemove) || [],
    });
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
        backPath="/worker/dashboard"
        showLogoutButton={true}
        showSettingsButton={false}
        showProfileButton={false}
        showPostJobButton={false}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Edit Your Profile</CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Gig Worker Account
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profile.fullName || ""}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1234567890"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    value={profile.experienceLevel || ""}
                    onValueChange={(value) => setProfile({ ...profile, experienceLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="pl-3 pr-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself and your experience"
                  value={profile.bio || ""}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedPay">Expected Pay (₹ per hour)</Label>
                <Input
                  id="expectedPay"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="500.00"
                  value={profile.expectedPayPerHour || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, expectedPayPerHour: parseFloat(e.target.value) })
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default WorkerProfileFirebase;
