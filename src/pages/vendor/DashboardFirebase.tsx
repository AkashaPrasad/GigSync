import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUserData, signOutUser } from "@/integrations/firebase/auth";
import { getVendorProfile, getJobsByVendor, updateJobApplication, Job, JobApplication, VendorProfile } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Briefcase, Home, LogOut, Plus, Settings, Users } from "lucide-react";

const VendorDashboardFirebase = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        await fetchData(user.uid);
      } else {
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    try {
      // Fetch vendor profile
      const profileData = await getVendorProfile(userId);
      if (!profileData) {
        toast.error("Vendor profile not found");
        navigate("/auth");
        return;
      }
      setProfile(profileData);

      // Fetch vendor's jobs
      const jobsData = await getJobsByVendor(profileData.id);
      setJobs(jobsData);

      // Fetch all applications for these jobs
      const allApplications: JobApplication[] = [];
      for (const job of jobsData) {
        const { getJobApplicationsByJob } = await import("@/integrations/firebase/firestore");
        const jobApplications = await getJobApplicationsByJob(job.id);
        allApplications.push(...jobApplications);
      }
      setApplications(allApplications);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await updateJobApplication(applicationId, { 
        status: "accepted",
        acceptedAt: new Date() as any
      });
      toast.success("Application accepted!");
      // Refresh data
      if (profile) {
        await fetchData(profile.userId);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigate("/");
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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">GigConnect</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button onClick={() => navigate("/vendor/post-job")}>
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigate("/vendor/settings")}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter((j) => j.status === "open").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently open</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
              <p className="text-xs text-muted-foreground">From all jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobs.filter((j) => j.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully finished</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Job Posts</h2>
          <div className="space-y-4">
            {jobs.map((job) => {
              const jobApplications = applications.filter(app => app.jobId === job.id);
              return (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription>{job.workType}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          job.status === "open"
                            ? "default"
                            : job.status === "completed"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requiredSkills?.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold">
                        Budget: ${job.payMin} - ${job.payMax}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {jobApplications.length} application(s)
                      </span>
                    </div>
                    {jobApplications.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Applicants</h4>
                        <div className="space-y-2">
                          {jobApplications.map((application) => (
                            <div
                              key={application.id}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <div>
                                <p className="font-medium">Application #{application.id.slice(-8)}</p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    Applied: {application.appliedAt?.toDate().toLocaleDateString()}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {application.status === "pending" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptApplication(application.id)}
                                  >
                                    Accept
                                  </Button>
                                )}
                                {application.status === "accepted" && (
                                  <Badge variant="default">Accepted</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {jobs.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't posted any jobs yet
                  </p>
                  <Button onClick={() => navigate("/vendor/post-job")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardFirebase;
