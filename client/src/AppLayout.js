import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { 
  BibleStudy, 
  PrayerNetwork, 
  OnlineCourses, 
  LiveServices, 
  ChurchPlanting,
  LibraryResources 
} from './components/services';
import ToolsPage from './components/tools/ToolsPage';
import { useAppContext } from './contexts/AppContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SubscriptionRequired from './components/auth/SubscriptionRequired';
import PremiumContentPage from './pages/PremiumContentPage';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import Breadcrumb from './components/Breadcrumb';
import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import TestPremiumPage from './pages/TestPremiumPage';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCanceled from './pages/SubscriptionCanceled';
import SubscriptionManagement from './pages/SubscriptionManagement';
import SubscriptionPlans from './pages/SubscriptionPlans';
import VersionDisplay from './components/common/VersionDisplay';
import Footer from './components/common/Footer';

const AppLayout = () => {
  const [isMobileView, setIsMobileView] = useState(() => window.innerWidth < 768);
  const { loading } = useAppContext();
  const resizeTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      
      resizeTimeout.current = setTimeout(() => {
        const mobile = window.innerWidth < 768;
        setIsMobileView(prev => prev !== mobile ? mobile : prev);
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      window.removeEventListener('resize', handleResize, { passive: true });
    };
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Navbar includes the Breadcrumb component */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1100, 
        width: '100%',
        backgroundColor: '#2c3e50'
      }}>
        <Navbar />
      </div>
      <div style={{ height: '80px' }} /> {/* Spacer to prevent content from being hidden behind fixed header */}
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        boxSizing: 'border-box',
        padding: isMobileView ? '0 1rem' : '0 2rem'
      }}>
        <main style={{
          flex: 1,
          paddingTop: '1rem',
          paddingBottom: '2rem',
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          minHeight: 'calc(100vh - 280px)'
        }}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subscription" element={<SubscriptionPlans />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/canceled" element={<SubscriptionCanceled />} />
          
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
          
          {/* Protected routes */}
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
          
          <Route path="/premium-content" element={
            <SubscriptionRequired>
              <PremiumContentPage />
            </SubscriptionRequired>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/account/subscription" element={
            <ProtectedRoute>
              <SubscriptionManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/testpremium" element={
            <SubscriptionRequired>
              <TestPremiumPage />
            </SubscriptionRequired>
          } />
        </Routes>
        </main>
        
        <Footer />
      </div>
      
      {/* Version display in corner */}
      <div style={{ position: 'fixed', bottom: 10, left: 10, zIndex: 1000 }}>
        <VersionDisplay />
      </div>
    </div>
  );
};

export default AppLayout;
