import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { 
  BibleStudy, 
  PrayerNetwork, 
  OnlineCourses, 
  LiveServices, 
  ChurchPlanting,
  LibraryResources 
} from './components/services';
import ToolsPage from './components/tools/ToolsPage';
import { useAppContext, useAuth } from './contexts/AppContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SubscriptionRequired from './components/auth/SubscriptionRequired';
import PremiumContentPage from './pages/PremiumContentPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Breadcrumb from './components/Breadcrumb';
import ScrollToTop from './components/ScrollToTop';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import AdminRoutes from './routes/AdminRoutes';
import TestPremiumPage from './pages/TestPremiumPage';

const AppLayout = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const { loading } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f5f7fa'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        backgroundColor: '#2c3e50',
        padding: '1rem 2rem',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <Navbar />
      </header>
      
      <main style={{
        flex: 1,
        padding: isMobileView ? '1rem' : '2rem',
        paddingTop: isMobileView ? '80px' : '100px',
        paddingBottom: '2rem',
        maxWidth: '100%',
        width: '100%',
        margin: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        <ScrollToTop />
        <Breadcrumb />
        <Routes>
          {/* Public splash pages */}
          <Route path="/bible" element={<BibleStudy splash={true} />} />
          <Route path="/prayer" element={<PrayerNetwork splash={true} />} />
          <Route path="/class" element={<OnlineCourses splash={true} />} />
          <Route path="/live" element={<LiveServices splash={true} />} />
          <Route path="/plant" element={<ChurchPlanting splash={true} />} />
          {/* Library Routes */}
          <Route path="/library" element={<LibraryResources splash={true} />} />
          <Route path="/library/ebook" element={<>E-Books Content</>} />
          <Route path="/library/homeschool" element={<>Homeschool Help Content</>} />
          <Route path="/library/av" element={<>Audio/Video Content</>} />
          <Route path="/library/devo" element={<>Devotionals Content</>} />
          <Route path="/library/article" element={<>Articles Content</>} />
          <Route path="/library/tool" element={<ToolsPage />} />
          
          {/* Protected routes for actual functionality */}
          <Route path="/bible-study" element={
            <ProtectedRoute>
              <BibleStudy />
            </ProtectedRoute>
          } />
          <Route path="/prayer/dashboard" element={
            <ProtectedRoute>
              <PrayerNetwork />
            </ProtectedRoute>
          } />
          <Route path="/courses/dashboard" element={
            <ProtectedRoute>
              <OnlineCourses />
            </ProtectedRoute>
          } />
          <Route path="/live/dashboard" element={
            <ProtectedRoute>
              <LiveServices />
            </ProtectedRoute>
          } />
          <Route path="/plant/dashboard" element={
            <ProtectedRoute>
              <ChurchPlanting />
            </ProtectedRoute>
          } />
          <Route path="/library/dashboard" element={
            <ProtectedRoute>
              <LibraryResources />
            </ProtectedRoute>
          } />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/premium-content" 
            element={
              <SubscriptionRequired>
                <PremiumContentPage />
              </SubscriptionRequired>
            } 
          />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home />} />
          
          {/* Test Premium Page */}
          <Route 
            path="/testpremium" 
            element={
              <SubscriptionRequired>
                <TestPremiumPage />
              </SubscriptionRequired>
            } 
          />
        </Routes>
      </main>
    </div>
  );
};

export default AppLayout;
