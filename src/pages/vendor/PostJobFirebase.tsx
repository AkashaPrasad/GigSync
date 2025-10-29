import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUserData } from "@/integrations/firebase/auth";
import { getVendorProfile, createJob } from "@/integrations/firebase/firestore";
import { AITextInput, AILocationInput, AISkillsInput } from "@/components/ui/ai-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { AIService, JobTitleSuggestion, SkillSuggestion } from "@/services/aiService";
import { LocationService, LocationSuggestion } from "@/services/locationService";

const PostJobFirebase = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workType: "",
    requiredSkills: [] as string[],
    payMin: "",
    payMax: "",
    location: "",
  });

  // AI suggestions state
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<JobTitleSuggestion[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<SkillSuggestion[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [loadingJobTitles, setLoadingJobTitles] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        const userData = await getCurrentUserData();
        if (userData && userData.role === "vendor") {
          const profile = await getVendorProfile(user.uid);
          if (profile) {
            setVendorProfile(profile);
          } else {
            toast.error("Vendor profile not found");
            navigate("/auth");
          }
        } else {
          navigate("/auth");
        }
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!vendorProfile) {
        toast.error("Vendor profile not found");
        return;
      }

      await createJob({
        vendorId: vendorProfile.id,
        title: formData.title,
        description: formData.description,
        workType: formData.workType,
        requiredSkills: formData.requiredSkills,
        payMin: parseFloat(formData.payMin),
        payMax: parseFloat(formData.payMax),
        status: "open"
      });

      toast.success("Job posted successfully!");
      navigate("/vendor/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skillToRemove),
    });
  };

  // AI suggestion functions
  const loadJobTitleSuggestions = async (query: string) => {
    if (query.length < 2) {
      setJobTitleSuggestions([]);
      return;
    }
    
    setLoadingJobTitles(true);
    try {
      const suggestions = await AIService.getJobTitleSuggestions(query);
      setJobTitleSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading job title suggestions:', error);
    } finally {
      setLoadingJobTitles(false);
    }
  };

  const loadSkillSuggestions = async (query: string) => {
    if (query.length < 1) {
      setSkillSuggestions([]);
      return;
    }
    
    setLoadingSkills(true);
    try {
      const suggestions = await AIService.getSkillSuggestions(query, formData.title);
      setSkillSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading skill suggestions:', error);
    } finally {
      setLoadingSkills(false);
    }
  };

  const loadLocationSuggestions = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    
    setLoadingLocations(true);
    try {
      const suggestions = await LocationService.getLocationSuggestions(query);
      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading location suggestions:', error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleJobTitleSelect = (suggestion: JobTitleSuggestion) => {
    setFormData(prev => ({
      ...prev,
      title: suggestion.title
    }));
    setJobTitleSuggestions([]);
    
    // Load skill suggestions based on selected job title
    loadSkillSuggestions("");
  };

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setFormData(prev => ({
      ...prev,
      location: suggestion.description
    }));
    setLocationSuggestions([]);
  };

  const handleSkillSelect = (skill: string) => {
    if (skill.trim() && !formData.requiredSkills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skill.trim()]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        backPath="/vendor/dashboard"
        showLogoutButton={true}
        showSettingsButton={true}
        settingsPath="/vendor/settings"
        showProfileButton={true}
        profilePath="/vendor/settings"
        showPostJobButton={false}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post a New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AITextInput
                label="Job Title"
                value={formData.title}
                onChange={(value) => {
                  setFormData({ ...formData, title: value });
                  loadJobTitleSuggestions(value);
                }}
                placeholder="e.g., Software Developer, Graphic Designer, Content Writer"
                suggestions={jobTitleSuggestions}
                onSuggestionSelect={handleJobTitleSelect}
                loading={loadingJobTitles}
              />

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job requirements and expectations..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workType">Type of Work</Label>
                <Input
                  id="workType"
                  placeholder="e.g., Delivery, Construction, Tech Support"
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  required
                />
              </div>

              <AILocationInput
                label="Location"
                value={formData.location}
                onChange={(value) => {
                  setFormData({ ...formData, location: value });
                  loadLocationSuggestions(value);
                }}
                onLocationSelect={handleLocationSelect}
                suggestions={locationSuggestions}
                loading={loadingLocations}
                placeholder="Enter job location or 'Remote'"
              />

              <AISkillsInput
                label="Required Skills"
                value={formData.requiredSkills}
                onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
                suggestions={skillSuggestions}
                onSuggestionSelect={handleSkillSelect}
                onInputChange={loadSkillSuggestions}
                loading={loadingSkills}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="payMin">Minimum Pay (₹)</Label>
                  <Input
                    id="payMin"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="500.00"
                    value={formData.payMin}
                    onChange={(e) => setFormData({ ...formData, payMin: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payMax">Maximum Pay (₹)</Label>
                  <Input
                    id="payMax"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1000.00"
                    value={formData.payMax}
                    onChange={(e) => setFormData({ ...formData, payMax: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Posting..." : "Post Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostJobFirebase;
