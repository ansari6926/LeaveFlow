import React from 'react';
import Hero3D from '../components/Hero3D';
import { 
  Sparkles, Calendar, ShieldCheck, CheckCircle2, 
  Clock, Zap, Lock, ArrowRight, UserCheck, CheckSquare, Layers
} from 'lucide-react';

export default function LandingPage({ onOpenLogin, onOpenDemoDeck }) {
  return (
    <div style={{ color: '#f8fafc' }}>
      {/* HERO SECTION */}
      <section id="hero" style={{ padding: '60px 0 80px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '40px', alignItems: 'center' }}>
            
            {/* Left Hero Headline & Copy */}
            <div>
              <div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  color: '#60a5fa',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '24px'
                }}
              >
                <Sparkles style={{ width: '16px', height: '16px' }} />
                <span>Next-Gen Employee Leave Management</span>
              </div>

              <h1 
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  marginBottom: '20px'
                }}
              >
                Leave Management, <span className="text-gradient-accent">Simplified.</span>
              </h1>

              <p 
                style={{
                  fontSize: '1.1rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '540px'
                }}
              >
                LeaveFlow streamlines employee leave requests, manager approvals, and leave balance tracking with real-time business validation logic and 3D visual clarity.
              </p>

              {/* Hero Call to Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button 
                  id="btn-hero-employee-start"
                  onClick={() => onOpenLogin('EMPLOYEE')} 
                  className="btn btn-primary"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                >
                  <UserCheck style={{ width: '20px', height: '20px' }} />
                  <span>Get Started (Employee)</span>
                </button>

                <button 
                  id="btn-hero-manager-portal"
                  onClick={() => onOpenLogin('MANAGER')} 
                  className="btn btn-secondary"
                  style={{ padding: '14px 24px', fontSize: '1rem' }}
                >
                  <ShieldCheck style={{ width: '20px', height: '20px', color: '#c084fc' }} />
                  <span>Manager Portal</span>
                </button>
              </div>

              {/* Assessment Trust Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#94a3b8' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span>14 Business Rules</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#94a3b8' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span>Half-Day Support</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#94a3b8' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
                  <span>Automated QA Suite</span>
                </div>
              </div>
            </div>

            {/* Right Glossy 3D Hero Centerpiece */}
            <div style={{ height: '480px', position: 'relative' }}>
              <Hero3D />
            </div>

          </div>
        </div>
      </section>

      {/* WHY LEAVEFLOW METRICS SECTION */}
      <section id="features" style={{ padding: '60px 0', background: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <Zap style={{ width: '32px', height: '32px', color: '#3b82f6', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>Zero-Friction Submission</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Instant leave calculations for annual, casual, sick, and half-day duration modes.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <ShieldCheck style={{ width: '32px', height: '32px', color: '#8b5cf6', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>Strict Business Logic</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Automated overlap prevention, balance caps, self-approval guards, and state immutability.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <CheckSquare style={{ width: '32px', height: '32px', color: '#10b981', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>Audit & Rejection Records</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8' }}>
                Mandatory rejection reasons, review timestamps, and employee visibility log.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS WORKFLOW */}
      <section id="workflow" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              End-to-End Workflow
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginTop: '8px' }}>
              How LeaveFlow Automates Approvals
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', position: 'relative' }}>
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontWeight: 800, fontSize: '1.2rem' }}>
                1
              </div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '8px' }}>Submit Request</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Employee picks dates, leave category, and full/half-day mode.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontWeight: 800, fontSize: '1.2rem' }}>
                2
              </div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '8px' }}>Validation Engine</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Server validates balance limits, date logic, and overlapping requests.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontWeight: 800, fontSize: '1.2rem' }}>
                3
              </div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '8px' }}>Manager Review</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Manager approves or rejects with mandatory feedback notes.</p>
            </div>

            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontWeight: 800, fontSize: '1.2rem' }}>
                4
              </div>
              <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '8px' }}>Balance Sync</h4>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Approved leave deducts from balance; employee sees instant update.</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTELLIGENT BUSINESS VALIDATION GRID */}
      <section id="validation" style={{ padding: '60px 0', background: 'rgba(15, 23, 42, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <h2 style={{ fontSize: '2rem', color: '#ffffff' }}>Enforced Business Rules</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
              Guaranteed integrity across frontend & backend controllers
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              'Start date cannot be after end date',
              'Leave duration must be > 0 days',
              'Cannot exceed available leave balance',
              'Overlapping leave requests rejected',
              'Duplicate / conflicting requests rejected',
              'Only pending requests can be approved',
              'Only pending requests can be rejected',
              'Approved leave reduces available balance',
              'Rejected leave retains existing balance',
              'Rejection requires mandatory reason',
              'Employee cannot approve own request',
              'Completed requests are immutable',
              'Private employee leave multi-tenant protection',
              'Half-day leave support (0.5 day math)'
            ].map((rule, idx) => (
              <div 
                key={idx} 
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 500 }}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL ASSESSMENT CTA SECTION */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="glass-panel" style={{ padding: '60px 30px', maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
            <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '16px' }}>Ready to Explore LeaveFlow?</h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '32px', maxWidth: '560px', margin: '0 auto 32px auto' }}>
              Test employee leave submissions, manager approval workflows, or inspect automated QA test evidence.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onOpenLogin('EMPLOYEE')} 
                className="btn btn-primary"
                style={{ padding: '14px 28px' }}
              >
                Launch Employee Portal
              </button>
              <button 
                onClick={() => onOpenLogin('MANAGER')} 
                className="btn btn-secondary"
                style={{ padding: '14px 28px' }}
              >
                Launch Manager Portal
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
