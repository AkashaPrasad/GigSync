import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, X } from "lucide-react";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    work_type: "",
    required_skills: [] as string[],
    duration_hours: "",
    duration_days: "",
    pay_min: "",
    pay_max: "",
    workers_needed: "1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get vendor profile
      const { data: vendorProfile, error: vendorError } = await supabase
        .from("vendor_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (vendorError) throw vendorError;

      const { error } = await supabase.from("jobs").insert({
        vendor_id: vendorProfile.id,
        title: formData.title,
        description: formData.description,
        work_type: formData.work_type,
        required_skills: formData.required_skills,
        duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
        pay_min: parseFloat(formData.pay_min),
        pay_max: parseFloat(formData.pay_max),
        workers_needed: parseInt(formData.workers_needed),
      });

      if (error) throw error;
      toast.success("Job posted successfully!");
      navigate("/vendor/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.required_skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        required_skills: [...formData.required_skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills.filter((s) => s !== skillToRemove),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/vendor/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post a New Job</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Delivery Driver Needed"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

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
                  value={formData.work_type}
                  onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add a required skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map((skill, index) => (
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

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="durationHours">Duration (hours)</Label>
                  <Input
                    id="durationHours"
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="durationDays">Duration (days)</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    min="0"
                    placeholder="Optional"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="payMin">Minimum Pay</Label>
                  <Input
                    id="payMin"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.pay_min}
                    onChange={(e) => setFormData({ ...formData, pay_min: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payMax">Maximum Pay</Label>
                  <Input
                    id="payMax"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.pay_max}
                    onChange={(e) => setFormData({ ...formData, pay_max: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workersNeeded">Number of Workers Needed</Label>
                <Input
                  id="workersNeeded"
                  type="number"
                  min="1"
                  value={formData.workers_needed}
                  onChange={(e) => setFormData({ ...formData, workers_needed: e.target.value })}
                  required
                />
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

export default PostJob;
