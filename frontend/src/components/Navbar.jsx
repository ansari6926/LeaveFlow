import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, CalendarCheck, LogOut, UserCheck, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenLogin, activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  return (
    <nav 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('LANDING')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
            }}
          >
            <CalendarCheck style={{ width: '22px', height: '22px', color: '#ffffff' }} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Leave<span style={{ color: '#3b82f6' }}>Flow</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 700 }}>
              AI QA ASSESSMENT EDITION
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => setActiveTab('LANDING')}
            style={{
              background: 'none',
              border: 'none',
              color: activeTab === 'LANDING' ? '#3b82f6' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer'
            }}
          >
            Overview
          </button>

          {user && (
            <button 
              onClick={() => setActiveTab(user.role === 'MANAGER' ? 'MANAGER_DASHBOARD' : 'EMPLOYEE_DASHBOARD')}
              style={{
                background: 'none',
                border: 'none',
                color: (activeTab === 'EMPLOYEE_DASHBOARD' || activeTab === 'MANAGER_DASHBOARD') ? '#3b82f6' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              My Dashboard
            </button>
          )}

          <a 
            href="#features" 
            style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}
          >
            Features
          </a>
          <a 
            href="#workflow" 
            style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}
          >
            Workflow
          </a>
        </div>

        {/* User Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{user.name}</span>
                <span className={`badge ${user.role === 'MANAGER' ? 'badge-approved' : 'badge-pending'}`}>
                  {user.role}
                </span>
              </div>
              <button 
                onClick={logout} 
                className="btn btn-secondary btn-sm"
                title="Sign Out"
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => onOpenLogin('EMPLOYEE')} 
                className="btn btn-secondary btn-sm"
                id="btn-nav-employee-login"
              >
                <UserCheck style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                Employee Sign In
              </button>
              <button 
                onClick={() => onOpenLogin('MANAGER')} 
                className="btn btn-primary btn-sm"
                id="btn-nav-manager-login"
              >
                <ShieldCheck style={{ width: '16px', height: '16px' }} />
                Manager Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
