import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LeaveRequestModal from '../components/LeaveRequestModal';
import { Plus, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function EmployeeDashboard() {
  const { user, refreshUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    const token = localStorage.getItem('leaveflow_token');
    try {
      const res = await fetch('/api/leave/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Error fetching requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    refreshUser();
  }, []);

  const handleRequestSubmitted = (newReq) => {
    fetchRequests();
    refreshUser();
  };

  const balances = user?.balances || {
    ANNUAL: { total: 15, used: 0, available: 15 },
    CASUAL: { total: 10, used: 0, available: 10 },
    SICK: { total: 10, used: 0, available: 10 }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Header Profile Summary */}
      <div 
        className="glass-panel" 
        style={{
          padding: '28px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src={user?.avatar} 
            alt={user?.name} 
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid #3b82f6', objectFit: 'cover' }} 
          />
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#ffffff' }}>
              Welcome back, <span style={{ color: '#3b82f6' }}>{user?.name}</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              {user?.department} • Employee Leave Workspace & Activity Log
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={fetchRequests} 
            className="btn btn-secondary btn-sm"
            title="Refresh Data"
          >
            <RefreshCw style={{ width: '16px', height: '16px' }} />
            Sync
          </button>
          <button 
            id="btn-open-request-modal"
            onClick={() => setIsModalOpen(true)} 
            className="btn btn-primary"
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            Request Leave
          </button>
        </div>
      </div>

      {/* Real-time Leave Balance Cards */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#ffffff' }}>
        Available Leave Balances
      </h2>
      
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}
      >
        {/* Annual Leave Card */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Annual Leave
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total: {balances.ANNUAL.total} Days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <span id="balance-annual-available" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
              {balances.ANNUAL.available}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Days Available</span>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
            <div 
              style={{
                width: `${(balances.ANNUAL.available / balances.ANNUAL.total) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                borderRadius: '9999px'
              }} 
            />
          </div>
          <span style={{ display: 'block', marginTop: '8px', fontSize: '0.78rem', color: '#64748b' }}>
            Used: {balances.ANNUAL.used} day(s)
          </span>
        </div>

        {/* Casual Leave Card */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Casual Leave
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total: {balances.CASUAL.total} Days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <span id="balance-casual-available" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
              {balances.CASUAL.available}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Days Available</span>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
            <div 
              style={{
                width: `${(balances.CASUAL.available / balances.CASUAL.total) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #8b5cf6, #c084fc)',
                borderRadius: '9999px'
              }} 
            />
          </div>
          <span style={{ display: 'block', marginTop: '8px', fontSize: '0.78rem', color: '#64748b' }}>
            Used: {balances.CASUAL.used} day(s)
          </span>
        </div>

        {/* Sick Leave Card */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sick Leave
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total: {balances.SICK.total} Days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <span id="balance-sick-available" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
              {balances.SICK.available}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Days Available</span>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
            <div 
              style={{
                width: `${(balances.SICK.available / balances.SICK.total) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #34d399)',
                borderRadius: '9999px'
              }} 
            />
          </div>
          <span style={{ display: 'block', marginTop: '8px', fontSize: '0.78rem', color: '#64748b' }}>
            Used: {balances.SICK.used} day(s)
          </span>
        </div>
      </div>

      {/* Submitted Requests Activity Log */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#ffffff' }}>
        My Leave Requests History
      </h2>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {requests.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            <Calendar style={{ width: '40px', height: '40px', color: '#64748b', marginBottom: '12px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No leave requests submitted yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Click "Request Leave" above to apply for annual, casual or sick leave.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                  <th style={{ padding: '16px 20px' }}>Leave Category</th>
                  <th style={{ padding: '16px 20px' }}>Dates & Duration</th>
                  <th style={{ padding: '16px 20px' }}>Mode</th>
                  <th style={{ padding: '16px 20px' }}>Reason</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px' }}>Review Info</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr 
                    key={req.id} 
                    id={`request-row-${req.id}`}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' }}
                  >
                    <td style={{ padding: '16px 20px', fontWeight: 600, color: '#ffffff' }}>
                      {req.leaveType} LEAVE
                    </td>
                    <td style={{ padding: '16px 20px', color: '#e2e8f0' }}>
                      <div>{req.startDate} to {req.endDate}</div>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{req.daysCount} Day(s)</span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#94a3b8' }}>
                      <span style={{ fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: '4px' }}>
                        {req.durationType === 'FULL_DAY' ? 'Full Day' : req.durationType === 'FIRST_HALF' ? 'First Half (0.5)' : 'Second Half (0.5)'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#cbd5e1', maxWidth: '240px' }}>
                      {req.reason}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge ${
                        req.status === 'APPROVED' ? 'badge-approved' :
                        req.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: '#94a3b8' }}>
                      {req.status === 'REJECTED' ? (
                        <div style={{ color: '#f87171' }}>
                          <strong>Reason:</strong> {req.rejectionReason}
                        </div>
                      ) : req.status === 'APPROVED' ? (
                        <div style={{ color: '#34d399' }}>
                          Approved by {req.reviewedBy}
                        </div>
                      ) : (
                        <span>Awaiting Manager Review</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submit Leave Modal */}
      <LeaveRequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userBalances={balances}
        onRequestSubmitted={handleRequestSubmitted}
      />
    </div>
  );
}
