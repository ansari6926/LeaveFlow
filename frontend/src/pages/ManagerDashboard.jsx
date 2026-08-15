import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RejectionModal from '../components/RejectionModal';
import { ShieldCheck, CheckCircle, XCircle, Clock, Users, RefreshCw, AlertCircle } from 'lucide-react';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRejectReq, setSelectedRejectReq] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('leaveflow_token');
    try {
      const [reqRes, empRes] = await Promise.all([
        fetch('/api/leave/requests', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/users/employees', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData.requests);
      }
      if (empRes.ok) {
        const empData = await empRes.json();
        setEmployees(empData.employees);
      }
    } catch (err) {
      setError('Error connecting to LeaveFlow server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (requestId) => {
    setError('');
    const token = localStorage.getItem('leaveflow_token');
    try {
      const res = await fetch(`/api/leave/requests/${requestId}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve request');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleConfirmReject = async (requestId, rejectionReason) => {
    setError('');
    const token = localStorage.getItem('leaveflow_token');
    const res = await fetch(`/api/leave/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rejectionReason })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reject request');
    fetchData();
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const historyRequests = requests.filter(r => r.status !== 'PENDING');

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
          <div 
            style={{
              padding: '12px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              color: '#ffffff'
            }}
          >
            <ShieldCheck style={{ width: '36px', height: '36px' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', color: '#ffffff' }}>
              Manager Control Portal — <span style={{ color: '#c084fc' }}>{user?.name}</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Review pending employee leave requests, enforce business constraints & inspect balances
            </p>
          </div>
        </div>

        <button 
          onClick={fetchData} 
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw style={{ width: '16px', height: '16px' }} />
          Refresh Requests
        </button>
      </div>

      {error && (
        <div 
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#f87171',
            padding: '14px',
            borderRadius: '10px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          id="manager-error-alert"
        >
          <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Pending Approvals Section */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock style={{ width: '20px', height: '20px', color: '#fbbf24' }} />
        Pending Approval Queue ({pendingRequests.length})
      </h2>

      <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px' }}>
        {pendingRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8' }}>
            <CheckCircle style={{ width: '36px', height: '36px', color: '#10b981', marginBottom: '10px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>Queue Clean!</p>
            <p style={{ fontSize: '0.85rem' }}>No pending leave requests requiring manager review.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pendingRequests.map((req) => (
              <div 
                key={req.id} 
                id={`pending-card-${req.id}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{req.userName}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({req.userEmail})</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                      {req.leaveType}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    📅 <strong>{req.startDate}</strong> to <strong>{req.endDate}</strong> ({req.daysCount} Day(s) — {req.durationType})
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    "{req.reason}"
                  </div>
                </div>

                {/* Manager Decision Actions */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    id={`btn-approve-request-${req.id}`}
                    onClick={() => handleApprove(req.id)}
                    className="btn btn-success btn-sm"
                  >
                    <CheckCircle style={{ width: '16px', height: '16px' }} />
                    Approve
                  </button>

                  <button 
                    id={`btn-reject-request-${req.id}`}
                    onClick={() => setSelectedRejectReq(req)}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle style={{ width: '16px', height: '16px' }} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Employee Balances Overview */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Users style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
        Team Leave Balances Overview
      </h2>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}
      >
        {employees.map((emp) => (
          <div key={emp.id} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img src={emp.avatar} alt={emp.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <h4 style={{ fontSize: '1rem', color: '#ffffff' }}>{emp.name}</h4>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{emp.department}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', background: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#60a5fa', fontWeight: 700 }}>ANNUAL</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{emp.balances.ANNUAL.available}d</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#c084fc', fontWeight: 700 }}>CASUAL</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{emp.balances.CASUAL.available}d</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>SICK</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{emp.balances.SICK.available}d</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approval History Log */}
      <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#ffffff' }}>
        Processed Approval History Log
      </h2>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '14px 20px' }}>Employee</th>
              <th style={{ padding: '14px 20px' }}>Leave Type</th>
              <th style={{ padding: '14px 20px' }}>Dates</th>
              <th style={{ padding: '14px 20px' }}>Decision</th>
              <th style={{ padding: '14px 20px' }}>Reviewed By</th>
            </tr>
          </thead>
          <tbody>
            {historyRequests.map((req) => (
              <tr key={req.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '14px 20px', color: '#ffffff', fontWeight: 600 }}>{req.userName}</td>
                <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{req.leaveType} ({req.daysCount}d)</td>
                <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>{req.startDate} to {req.endDate}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span className={`badge ${req.status === 'APPROVED' ? 'badge-approved' : 'badge-rejected'}`}>
                    {req.status}
                  </span>
                  {req.rejectionReason && (
                    <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '2px' }}>
                      "{req.rejectionReason}"
                    </div>
                  )}
                </td>
                <td style={{ padding: '14px 20px', color: '#94a3b8' }}>{req.reviewedBy || 'System'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejection Reason Modal */}
      <RejectionModal 
        isOpen={!!selectedRejectReq}
        onClose={() => setSelectedRejectReq(null)}
        request={selectedRejectReq}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  );
}
