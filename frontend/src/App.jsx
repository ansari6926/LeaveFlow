import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import LandingPage from './pages/LandingPage';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('LANDING');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState('EMPLOYEE');

  const handleOpenLogin = (role = 'EMPLOYEE') => {
    setLoginRole(role);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    // Navigate automatically based on role after successful login
    if (user?.role === 'MANAGER' || loginRole === 'MANAGER') {
      setActiveTab('MANAGER_DASHBOARD');
    } else {
      setActiveTab('EMPLOYEE_DASHBOARD');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        onOpenLogin={handleOpenLogin} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'LANDING' && (
          <LandingPage onOpenLogin={handleOpenLogin} />
        )}

        {activeTab === 'EMPLOYEE_DASHBOARD' && user && (
          <EmployeeDashboard />
        )}

        {activeTab === 'MANAGER_DASHBOARD' && user && user.role === 'MANAGER' && (
          <ManagerDashboard />
        )}

        {/* Fallback if accessing dashboard while unauthenticated */}
        {(activeTab === 'EMPLOYEE_DASHBOARD' || activeTab === 'MANAGER_DASHBOARD') && !user && (
          <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
            <div className="glass-panel" style={{ padding: '48px', maxWidth: '500px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '12px' }}>Authentication Required</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
                Please sign in as Employee or Manager to access dashboard features.
              </p>
              <button onClick={() => handleOpenLogin('EMPLOYEE')} className="btn btn-primary">
                Sign In Now
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        initialRole={loginRole}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
