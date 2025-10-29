import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUserData } from "@/integrations/firebase/auth";
import { getVendorProfile, getJobsByVendor, getJobApplicationsByJob, updateJobApplication, getPendingJobRequests, Job, JobApplication, VendorProfile, JobRequest } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, Search, Filter, CheckCircle, XCircle, Clock, User, Briefcase } from "lucide-react";
import Navigation from "@/components/Navigation";
import { demoJobRequests, demoJobPostings, demoApplications } from "@/data/demoData";

const ExploreJobApplications = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"applications" | "accepted">("applications");

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
          const jobApplications = await getJobApplicationsByJob(job.id);
          allApplications.push(...jobApplications);
        }
        setApplications(allApplications.length > 0 ? allApplications : demoApplications);
      } catch (error) {
        console.log("Using demo applications");
        setApplications(demoApplications);
      }

      // Fetch job requests (with demo data fallback)
      try {
        const requestsData = await getPendingJobRequests();
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

  const handleAcceptApplication = async (applicationId: string) => {
    try {
      await updateJobApplication(applicationId, { 
        status: "accepted",
        acceptedAt: new Date() as any
      });
      toast.success("Application accepted!");
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: "accepted", acceptedAt: new Date() as any }
            : app
        )
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    try {
      await updateJobApplication(applicationId, { 
        status: "rejected"
      });
      toast.success("Application rejected");
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: "rejected" }
            : app
        )
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job?.title || "Unknown Job";
  };

  const filteredApplications = applications.filter(application => {
    const job = jobs.find(j => j.id === application.jobId);
    const matchesSearch = !searchTerm || 
      (job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       application.id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesJob = selectedJob === "all" || application.jobId === selectedJob;
    const matchesStatus = statusFilter === "all" || application.status === statusFilter;
    
    return matchesSearch && matchesJob && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        backPath="/vendor/dashboard"
        showLogoutButton={true}
        showSettingsButton={true}
        settingsPath="/vendor/settings"
        showPostJobButton={true}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
          <p className="text-muted-foreground">
            Review and manage applications for your posted jobs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "applications"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4 mr-2 inline" />
            Job Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "accepted"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CheckCircle className="h-4 w-4 mr-2 inline" />
            Accepted Requests ({jobRequests.filter(req => req.status === 'accepted').length})
          </button>
        </div>

        {/* Applications Tab Content */}
        {activeTab === "applications" && (
          <>
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by job title or application ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by job" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const job = jobs.find(j => j.id === application.jobId);
            
            return (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {getJobTitle(application.jobId)}
                      </CardTitle>
                      <CardDescription>
                        Application #{application.id.slice(-8)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          application.status === "accepted" 
                            ? "default" 
                            : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {application.status === "accepted" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {application.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                        {application.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Job Details */}
                    {job && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <span className="text-sm text-muted-foreground">Job Title:</span>
                          <p className="font-medium">{job.title}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Pay Range:</span>
                          <p className="font-medium">₹{job.payMin}-{job.payMax}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Location:</span>
                          <p className="font-medium">{job.location || "Remote"}</p>
                        </div>
                      </div>
                    )}

                    {/* Application Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Applied On:</span>
                        <p className="font-medium">
                          {application.appliedAt?.toDate().toLocaleDateString()}
                        </p>
                      </div>
                      {application.acceptedAt && (
                        <div>
                          <span className="text-sm text-muted-foreground">Accepted On:</span>
                          <p className="font-medium">
                            {application.acceptedAt?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {application.status === "pending" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button 
                          onClick={() => handleAcceptApplication(application.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Accept Application
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => handleRejectApplication(application.id)}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Application
                        </Button>
                      </div>
                    )}

                    {application.status !== "pending" && (
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Worker ID:</span>
                          <span className="font-mono">{application.workerId.slice(-8)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedJob !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search terms or filters"
                  : "No applications have been submitted for your jobs yet"
                }
              </p>
              {(searchTerm || selectedJob !== "all" || statusFilter !== "all") && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedJob("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
          </>
        )}

        {/* Accepted Applications Tab Content */}
        {activeTab === "accepted" && (
          <div className="space-y-4">
            {jobRequests.filter(req => req.status === 'accepted').map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{request.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {request.description}
                      </CardDescription>
                    </div>
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Accepted
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
                      onClick={() => {
                        // Here you could add logic to manage the accepted request
                        toast.info("Manage functionality coming soon!");
                      }}
                      className="flex-1"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Manage Job
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Here you could add logic to view details
                        toast.info("View details functionality coming soon!");
                      }}
                      className="flex-1"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {jobRequests.filter(req => req.status === 'accepted').length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg font-medium mb-2">No Accepted Applications Yet</p>
                  <p className="text-sm mb-4">
                    When you accept job requests from workers, they will appear here for management.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("applications")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Job Applications
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExploreJobApplications;
