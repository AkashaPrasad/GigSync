import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUserData } from "@/integrations/firebase/auth";
import { getProfile, getOpenJobs, getJobApplications, createJobApplication, getJobRequestsByWorker, Job, JobApplication, Profile, JobRequest } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Briefcase, Star, Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { demoJobRequests, demoJobPostings, demoApplications } from "@/data/demoData";

const WorkerDashboardFirebase = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
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
      // Fetch worker profile
      const profileData = await getProfile(userId);
      if (!profileData) {
        toast.error("Worker profile not found");
        navigate("/auth");
        return;
      }
      setProfile(profileData);

      // Fetch available jobs (with demo data fallback)
      try {
        const jobsData = await getOpenJobs();
        setJobs(jobsData.length > 0 ? jobsData : demoJobPostings);
      } catch (error) {
        console.log("Using demo job postings");
        setJobs(demoJobPostings);
      }

      // Fetch worker's applications (with demo data fallback)
      try {
        const applicationsData = await getJobApplications(profileData.id);
        setApplications(applicationsData.length > 0 ? applicationsData : demoApplications);
      } catch (error) {
        console.log("Using demo applications");
        setApplications(demoApplications);
      }

      // Fetch worker's job requests (with demo data fallback)
      try {
        const requestsData = await getJobRequestsByWorker(profileData.id);
        setJobRequests(requestsData.length > 0 ? requestsData : demoJobRequests);
      } catch (error) {
        console.log("Using demo job requests");
        setJobRequests(demoJobRequests);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!profile) return;
    
    try {
      // Check if it's demo data
      if (jobId.startsWith('demo-job-')) {
        // For demo data, just update the local state
        const newApplication = {
          id: `demo-app-${Date.now()}`,
          jobId,
          workerId: profile.id,
          status: "pending" as const,
          appliedAt: { toDate: () => new Date() } as any
        };
        setApplications(prev => [...prev, newApplication]);
        toast.success("Application submitted successfully! (Demo)");
        return;
      }
      
      // For real data, create in Firestore
      await createJobApplication({
        jobId,
        workerId: profile.id,
        status: "pending"
      });
      toast.success("Application submitted successfully!");
      // Refresh applications
      const applicationsData = await getJobApplications(profile.id);
      setApplications(applicationsData);
    } catch (error: any) {
      toast.error(error.message);
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
        showLogoutButton={true}
        showSettingsButton={true}
        settingsPath="/worker/profile"
        showProfileButton={true}
        profilePath="/worker/profile"
        showPostJobButton={false}
        showExploreJobsButton={true}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold">Welcome back, {profile?.fullName || "Worker"}!</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Gig Worker Account
            </Badge>
          </div>
          <p className="text-muted-foreground">Manage your jobs, applications, and job requests</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.rating?.toFixed(1) || "0.0"}</div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Completed</CardTitle>
              <Briefcase className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.totalJobsCompleted || 0}</div>
              <p className="text-xs text-muted-foreground">Total gigs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expected Rate</CardTitle>
              <span className="text-success font-bold">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{profile?.expectedPayPerHour?.toFixed(0) || "0"}/hr
              </div>
              <p className="text-xs text-muted-foreground">Hourly rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription>Job ID: {job.id.slice(-8)}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-success/10 text-success">
                        ₹{job.payMin}-{job.payMax}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.requiredSkills?.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => handleApply(job.id)}
                      disabled={applications.some((app) => app.jobId === job.id)}
                      className="w-full"
                    >
                      {applications.some((app) => app.jobId === job.id)
                        ? "Applied"
                        : "Apply Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {jobs.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No jobs available at the moment
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">My Applications</h2>
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Application #{application.id.slice(-8)}</CardTitle>
                        <CardDescription>
                          Job ID: {application.jobId.slice(-8)}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          application.status === "accepted"
                            ? "default"
                            : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Applied on {application.appliedAt?.toDate().toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
              {applications.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No applications yet. Apply to jobs to get started!
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Job Requests Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Job Requests</h2>
              <Button onClick={() => navigate("/worker/create-job-request")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job Request
              </Button>
            </div>
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
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            request.status === "accepted" 
                              ? "default" 
                              : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {request.status === "accepted" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {request.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                          {request.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Hours:</span>
                        <p className="font-medium">{request.hours}h</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Pay Range:</span>
                        <p className="font-medium">₹{request.minPay}-{request.maxPay}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Urgency:</span>
                        <p className="font-medium capitalize">{request.urgency}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <p className="font-medium">{request.createdAt?.toDate().toLocaleDateString()}</p>
                      </div>
                    </div>
                    {request.skills.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm text-muted-foreground">Skills: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {request.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {request.location && (
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground">Location: </span>
                        <span className="text-sm font-medium">{request.location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {jobRequests.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No job requests yet. Create your first job request to get started!
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

export default WorkerDashboardFirebase;
