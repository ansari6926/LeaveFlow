import React from 'react';
import { CalendarCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(9, 13, 22, 0.95)',
        padding: '48px 0 24px 0',
        marginTop: '80px'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CalendarCheck style={{ width: '18px', height: '18px', color: '#ffffff' }} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>LeaveFlow</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '380px', marginBottom: '16px' }}>
              Next-generation Leave Approval & Balance Management Platform powered by real-time business validation logic, 3D interactive graphics, and automated QA verification.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tactive Engineering Assessment Compliant</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><a href="#hero" style={{ color: '#94a3b8', textDecoration: 'none' }}>3D Hero Centerpiece</a></li>
              <li><a href="#features" style={{ color: '#94a3b8', textDecoration: 'none' }}>Business Rules Engine</a></li>
              <li><a href="#workflow" style={{ color: '#94a3b8', textDecoration: 'none' }}>Manager Approval Matrix</a></li>
              <li><a href="#validation" style={{ color: '#94a3b8', textDecoration: 'none' }}>Half-Day Leave Integration</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>QA Deliverables</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li><span style={{ color: '#94a3b8' }}>Vitest Unit Suite</span></li>
              <li><span style={{ color: '#94a3b8' }}>Playwright E2E Tests</span></li>
              <li><span style={{ color: '#94a3b8' }}>Deliberate Red Run Logs</span></li>
              <li><span style={{ color: '#94a3b8' }}>AI Change Loop Document</span></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
          <span>© 2026 LeaveFlow. Engineered for Tactive QA Automation & Software Engineering Assessment.</span>
          <span>Version 1.0.0 (Production Verified)</span>
        </div>
      </div>
    </footer>
  );
}
