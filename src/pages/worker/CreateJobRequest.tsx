import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createJobRequest } from "@/integrations/firebase/firestore";
import { onAuthStateChange } from "@/integrations/firebase/auth";
import { AITextInput, AILocationInput, AISkillsInput } from "@/components/ui/ai-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { AIService, JobTitleSuggestion, SkillSuggestion } from "@/services/aiService";
import { LocationService, LocationSuggestion } from "@/services/locationService";

const CreateJobRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    hours: "",
    minPay: "",
    maxPay: "",
    skills: [] as string[],
    location: "",
    urgency: "medium" as "low" | "medium" | "high"
  });

  // AI suggestions state
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<JobTitleSuggestion[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<SkillSuggestion[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [loadingJobTitles, setLoadingJobTitles] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigate("/auth");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Trigger AI suggestions based on field
    if (field === 'title') {
      loadJobTitleSuggestions(value);
    } else if (field === 'location') {
      loadLocationSuggestions(value);
    }
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
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.hours || !formData.minPay || !formData.maxPay) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.minPay) >= parseFloat(formData.maxPay)) {
      toast.error("Minimum pay must be less than maximum pay");
      return;
    }

    if (formData.skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);
    try {
      await createJobRequest({
        workerId: userId,
        title: formData.title,
        description: formData.description,
        hours: parseInt(formData.hours),
        minPay: parseFloat(formData.minPay),
        maxPay: parseFloat(formData.maxPay),
        skills: formData.skills,
        location: formData.location || undefined,
        urgency: formData.urgency,
        status: 'pending'
      });

      toast.success("Job request created successfully!");
      navigate("/worker/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create job request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation 
        backPath="/worker/dashboard"
        showLogoutButton={true}
        showSettingsButton={true}
        settingsPath="/worker/profile"
        showPostJobButton={false}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Job Request</CardTitle>
            <p className="text-muted-foreground">
              Post a job request that vendors can see and accept
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <AITextInput
                label="Job Title *"
                value={formData.title}
                onChange={(value) => handleInputChange("title", value)}
                placeholder="e.g., Software Developer, Graphic Designer, Content Writer"
                suggestions={jobTitleSuggestions}
                onSuggestionSelect={handleJobTitleSelect}
                loading={loadingJobTitles}
              />

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the work you need done in detail..."
                  rows={4}
                  required
                />
              </div>

              {/* Hours and Pay */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Estimated Hours *</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="1"
                    value={formData.hours}
                    onChange={(e) => handleInputChange("hours", e.target.value)}
                    placeholder="e.g., 20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPay">Min Pay (₹) *</Label>
                  <Input
                    id="minPay"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minPay}
                    onChange={(e) => handleInputChange("minPay", e.target.value)}
                    placeholder="e.g., 500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPay">Max Pay (₹) *</Label>
                  <Input
                    id="maxPay"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxPay}
                    onChange={(e) => handleInputChange("maxPay", e.target.value)}
                    placeholder="e.g., 1000"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <AILocationInput
                label="Location (Optional)"
                value={formData.location}
                onChange={(value) => handleInputChange("location", value)}
                onLocationSelect={handleLocationSelect}
                suggestions={locationSuggestions}
                loading={loadingLocations}
                placeholder="e.g., New York, NY or Remote"
              />

              {/* Urgency */}
              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency</Label>
                <Select value={formData.urgency} onValueChange={(value: "low" | "medium" | "high") => handleInputChange("urgency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Flexible timeline</SelectItem>
                    <SelectItem value="medium">Medium - Within 2 weeks</SelectItem>
                    <SelectItem value="high">High - ASAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Skills */}
              <AISkillsInput
                label="Required Skills *"
                value={formData.skills}
                onChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
                suggestions={skillSuggestions}
                onSuggestionSelect={handleSkillSelect}
                loading={loadingSkills}
              />

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Job Request"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/worker/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateJobRequest;
