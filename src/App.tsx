import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/IndexFirebase";
import Auth from "./pages/AuthFirebase";
import About from "./pages/About";
import WorkerDashboard from "./pages/worker/DashboardFirebase";
import WorkerProfile from "./pages/worker/ProfileFirebase";
import CreateJobRequest from "./pages/worker/CreateJobRequest";
import ExploreJobs from "./pages/worker/ExploreJobs";
import VendorDashboard from "./pages/vendor/DashboardFirebase";
import VendorSettings from "./pages/vendor/SettingsFirebase";
import PostJob from "./pages/vendor/PostJobFirebase";
import ExploreJobApplications from "./pages/vendor/ExploreJobApplications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/worker/dashboard" element={<WorkerDashboard />} />
                  <Route path="/worker/profile" element={<WorkerProfile />} />
                  <Route path="/worker/create-job-request" element={<CreateJobRequest />} />
                  <Route path="/worker/explore-jobs" element={<ExploreJobs />} />
                  <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                  <Route path="/vendor/settings" element={<VendorSettings />} />
                  <Route path="/vendor/post-job" element={<PostJob />} />
                  <Route path="/vendor/explore-applications" element={<ExploreJobApplications />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
