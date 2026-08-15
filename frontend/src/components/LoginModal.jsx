import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserCheck, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, initialRole = 'EMPLOYEE', onSuccess }) {
  const { login } = useAuth();
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (targetRole) => {
    setRole(targetRole);
    if (targetRole === 'EMPLOYEE') {
      setEmail('employee@leaveflow.com');
      setPassword('Password123!');
    } else {
      setEmail('manager@leaveflow.com');
      setPassword('Password123!');
    }
    setError('');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '32px',
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#ffffff' }}>
          Sign In to <span style={{ color: '#3b82f6' }}>LeaveFlow</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '24px' }}>
          Access your leave workspace and real-time approval portal
        </p>

        {/* Role Toggle Tabs */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => handleQuickFill('EMPLOYEE')}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: role === 'EMPLOYEE' ? '#3b82f6' : 'transparent',
              color: role === 'EMPLOYEE' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <UserCheck style={{ width: '16px', height: '16px' }} />
            Employee
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('MANAGER')}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              background: role === 'MANAGER' ? '#8b5cf6' : 'transparent',
              color: role === 'MANAGER' ? '#ffffff' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck style={{ width: '16px', height: '16px' }} />
            Manager
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f87171',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            id="login-error-alert"
          >
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Work Email Address
            </label>
            <input 
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. employee@leaveflow.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.2)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Password
            </label>
            <input 
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.2)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <button 
            id="btn-login-submit"
            type="submit" 
            disabled={submitting}
            className={`btn ${role === 'MANAGER' ? 'btn-primary' : 'btn-primary'}`}
            style={{ width: '100%', padding: '14px', background: role === 'MANAGER' ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' : undefined }}
          >
            <span>{submitting ? 'Authenticating...' : `Sign In as ${role === 'MANAGER' ? 'Manager' : 'Employee'}`}</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </form>

        {/* Preset Quick Fill Helpers */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>Assessment Quick Demo Accounts:</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              id="btn-quick-fill-employee"
              type="button"
              onClick={() => handleQuickFill('EMPLOYEE')}
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Fill Employee Demo
            </button>
            <button
              id="btn-quick-fill-manager"
              type="button"
              onClick={() => handleQuickFill('MANAGER')}
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#c084fc',
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Fill Manager Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
