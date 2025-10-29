import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUserData } from "@/integrations/firebase/auth";
import { getVendorProfile, getJobsByVendor, updateJobApplication, getPendingJobRequests, acceptJobRequest, rejectJobRequest, Job, JobApplication, VendorProfile, JobRequest } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Briefcase, Users, CheckCircle, XCircle, Clock, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { demoJobRequests, demoJobPostings, demoApplications } from "@/data/demoData";

const VendorDashboardFirebase = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      try {
        console.log("Auth state changed, user:", user?.uid);
        if (user) {
          // Check user role first
          const userData = await getCurrentUserData();
          console.log("User data:", userData);
          if (!userData || userData.role !== "vendor") {
            console.log("User is not a vendor, redirecting to auth");
            toast.error("Access denied. You are not a vendor.");
            navigate("/auth");
            return;
          }
          console.log("User is a vendor, fetching data...");
          await fetchData(user.uid);
        } else {
          console.log("No user, redirecting to auth");
          navigate("/auth");
        }
      } catch (error: any) {
        console.error("Error in auth state change:", error);
        setError(error.message);
        toast.error("An error occurred while loading your account");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchData = async (userId: string) => {
    try {
      console.log("Fetching vendor profile for userId:", userId);
      // Fetch vendor profile
      const profileData = await getVendorProfile(userId);
      console.log("Vendor profile data:", profileData);
      if (!profileData) {
        console.log("No vendor profile found, redirecting to settings");
        toast.info("Please complete your vendor profile setup first.");
        navigate("/vendor/settings");
        return;
      }
      setProfile(profileData);

      // Fetch vendor's jobs (with demo data fallback)
      try {
        const jobsData = await getJobsByVendor(profileData.id);
        setJobs(jobsData.length > 0 ? jobsData : demoJobPostings);
      } catch (error) {
        console.log("Using demo job postings");
        setJobs(demoJobPostings);
      }

      // Fetch all applications for these jobs (with demo data fallback)
      try {
        const allApplications: JobApplication[] = [];
        for (const job of jobsData) {
          const { getJobApplicationsByJob } = await import("@/integrations/firebase/firestore");
          const jobApplications = await getJobApplicationsByJob(job.id);
          allApplications.push(...jobApplications);
        }
        setApplications(allApplications.length > 0 ? allApplications : demoApplications);
      } catch (error) {
        console.log("Using demo applications");
        setApplications(demoApplications);
      }

      // Fetch pending job requests (with demo data fallback)
      try {
        const requestsData = await getPendingJobRequests();
        setJobRequests(requestsData.length > 0 ? requestsData : demoJobRequests);
      } catch (error) {
        console.log("Using demo job requests");
        setJobRequests(demoJobRequests);
      }
    } catch (error: any) {
      console.error("Error fetching vendor data:", error);
      toast.error(error.message || "Failed to load vendor dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      // Check if it's demo data
      if (applicationId.startsWith('demo-app-')) {
        // For demo data, just update the local state
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: "accepted" as const, acceptedAt: { toDate: () => new Date() } as any }
            : app
        ));
        toast.success("Application accepted! (Demo)");
        return;
      }
      
      // For real data, update in Firestore
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

  const handleAcceptJobRequest = async (requestId: string) => {
    try {
      if (!profile) return;
      
      // Check if it's demo data
      if (requestId.startsWith('demo-request-')) {
        // For demo data, just update the local state
        setJobRequests(prev => prev.filter(req => req.id !== requestId));
        toast.success("Job request accepted successfully (Demo)");
        return;
      }
      
      // For real data, update in Firestore
      await acceptJobRequest(requestId, profile.id);
      setJobRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success("Job request accepted successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRejectJobRequest = async (requestId: string) => {
    try {
      // Check if it's demo data
      if (requestId.startsWith('demo-request-')) {
        // For demo data, just update the local state
        setJobRequests(prev => prev.filter(req => req.id !== requestId));
        toast.success("Job request rejected (Demo)");
        return;
      }
      
      // For real data, update in Firestore
      await rejectJobRequest(requestId);
      setJobRequests(prev => prev.filter(req => req.id !== requestId));
      toast.success("Job request rejected");
    } catch (error: any) {
      toast.error(error.message);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading vendor dashboard...</p>
          <p className="text-sm text-muted-foreground mt-2">Please wait while we set up your account</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive">Error loading vendor dashboard</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Setting up your vendor profile...</p>
          <p className="text-sm text-muted-foreground mt-2">Redirecting to profile setup</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation
        showLogoutButton={true}
        showSettingsButton={true}
        settingsPath="/vendor/settings"
        showProfileButton={true}
        profilePath="/vendor/settings"
        showPostJobButton={true}
        showExploreApplicationsButton={true}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Welcome back, {profile?.companyName || "Employer"}!</h1>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary">
              Employer Account
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">Manage your job postings and review applications</p>
            <Button 
              onClick={() => navigate("/vendor/post-job")}
              className="bg-primary hover:bg-primary/90"
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Create New Job
            </Button>
          </div>
        </div>

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
                        Budget: ₹{job.payMin} - {job.payMax}
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

          {/* Job Requests Section */}
          <div className="mt-8" data-section="job-requests">
            <h2 className="text-2xl font-bold mb-4">Job Requests from Workers</h2>
            <div className="space-y-4">
              {jobRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {request.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.urgency}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Hours:</span>
                        <p className="font-medium">{request.hours}h</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pay Range:</span>
                        <p className="font-medium">₹{request.minPay}-{request.maxPay}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="font-medium">{request.createdAt?.toDate().toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium">{request.location || "Not specified"}</p>
                      </div>
                    </div>
                    
                    {request.skills.length > 0 && (
                      <div className="mb-4">
                        <span className="text-sm text-muted-foreground">Required Skills: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        onClick={() => handleAcceptJobRequest(request.id)}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Request
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleRejectJobRequest(request.id)}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {jobRequests.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No job requests from workers at the moment
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDashboardFirebase;
