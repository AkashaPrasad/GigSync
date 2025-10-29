import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChange, getCurrentUserData } from "@/integrations/firebase/auth";
import { getOpenJobs, getJobApplications, createJobApplication, Job, JobApplication } from "@/integrations/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Briefcase, MapPin, Clock, Search, Filter } from "lucide-react";
import Navigation from "@/components/Navigation";
import { demoJobPostings, demoApplications } from "@/data/demoData";

const ExploreJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "applied" | "not_applied">("all");

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
      const [jobsData, applicationsData] = await Promise.all([
        getOpenJobs().catch(() => demoJobPostings),
        getJobApplications(userId).catch(() => demoApplications)
      ]);

      setJobs(jobsData.length > 0 ? jobsData : demoJobPostings);
      setApplications(applicationsData.length > 0 ? applicationsData : demoApplications);
    } catch (error: any) {
      console.log("Using demo data for Explore Jobs");
      setJobs(demoJobPostings);
      setApplications(demoApplications);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    try {
      const user = await getCurrentUserData();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      // Check if it's demo data
      if (jobId.startsWith('demo-job-')) {
        // For demo data, just update the local state
        const newApplication = {
          id: `demo-app-${Date.now()}`,
          jobId,
          workerId: user.uid,
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
        workerId: user.uid,
        status: 'pending'
      });

      toast.success("Application submitted successfully!");
      
      // Refresh applications
      const applicationsData = await getJobApplications(user.uid);
      setApplications(applicationsData);
    } catch (error: any) {
      toast.error(error.message || "Failed to apply for job");
    }
  };

  const isApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId);
  };

  const getApplicationStatus = (jobId: string) => {
    const application = applications.find(app => app.jobId === jobId);
    return application?.status || null;
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === "applied") {
      return matchesSearch && isApplied(job.id);
    } else if (filterStatus === "not_applied") {
      return matchesSearch && !isApplied(job.id);
    }
    
    return matchesSearch;
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
        backPath="/worker/dashboard"
        showLogoutButton={true}
        showSettingsButton={true}
        settingsPath="/worker/profile"
        showPostJobButton={false}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Jobs</h1>
          <p className="text-muted-foreground">
            Discover available job opportunities and apply to positions that match your skills
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All Jobs
              </Button>
              <Button
                variant={filterStatus === "applied" ? "default" : "outline"}
                onClick={() => setFilterStatus("applied")}
                size="sm"
              >
                Applied
              </Button>
              <Button
                variant={filterStatus === "not_applied" ? "default" : "outline"}
                onClick={() => setFilterStatus("not_applied")}
                size="sm"
              >
                Not Applied
              </Button>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const applied = isApplied(job.id);
            const applicationStatus = getApplicationStatus(job.id);
            
            return (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {job.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success">
                      ₹{job.payMin}-{job.payMax}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Job Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{job.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{job.location || "Remote"}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {job.requiredSkills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.requiredSkills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Application Status */}
                    <div className="pt-3 border-t">
                      {applied ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {applicationStatus === "accepted" && "Accepted"}
                              {applicationStatus === "rejected" && "Rejected"}
                              {applicationStatus === "pending" && "Application Pending"}
                            </span>
                          </div>
                          <Badge 
                            variant={
                              applicationStatus === "accepted" 
                                ? "default" 
                                : applicationStatus === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {applicationStatus}
                          </Badge>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleApply(job.id)}
                          className="w-full"
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      )}
                    </div>

                    {/* Job ID */}
                    <p className="text-xs text-muted-foreground">
                      Job ID: {job.id.slice(-8)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Try adjusting your search terms or filters"
                  : "No jobs are currently available"
                }
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ExploreJobs;
