import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import Index from './pages/Index';
import JobBoard from './pages/JobBoard';
import JobDetail from './pages/JobDetail';
import TalentPool from './pages/TalentPool';
import TalentDetail from './pages/TalentDetail';
import Community from './pages/Community';
import CommunityPost from './pages/CommunityPost';
import CommunityWrite from './pages/CommunityWrite';
import CommunityEdit from './pages/CommunityEdit';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import MyPage from './pages/MyPage';
import TalentRegister from './pages/TalentRegister';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/talent" element={<TalentPool />} />
          <Route path="/talent/:id" element={<TalentDetail />} />
          <Route path="/talent/register" element={<TalentRegister />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/write" element={<CommunityWrite />} />
          <Route path="/community/:id" element={<CommunityPost />} />
          <Route path="/community/:id/edit" element={<CommunityEdit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
