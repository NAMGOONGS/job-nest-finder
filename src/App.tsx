import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TalentPool from "./pages/TalentPool";
import TalentDetail from "./pages/TalentDetail";
import JobBoard from "./pages/JobBoard";
import JobDetail from "./pages/JobDetail";
import Community from "./pages/Community";
import CommunityWrite from "./pages/CommunityWrite";
import CommunityPost from "./pages/CommunityPost";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="talent" element={<TalentPool />} />
              <Route path="talent/:id" element={<TalentDetail />} />
              <Route path="jobs" element={<JobBoard />} />
              <Route path="jobs/:id" element={<JobDetail />} />
              <Route path="community" element={<Community />} />
              <Route path="community/write" element={<CommunityWrite />} />
              <Route path="community/:id" element={<CommunityPost />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
