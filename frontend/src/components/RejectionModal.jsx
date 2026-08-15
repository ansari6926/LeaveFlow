import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function RejectionModal({ isOpen, onClose, request, onConfirmReject }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!reason.trim()) {
      setError('Rejection reason is mandatory.');
      return;
    }

    setSubmitting(true);
    try {
      await onConfirmReject(request.id, reason.trim());
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to reject request');
    } finally {
      setSubmitting(false);
    }
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
          padding: '28px',
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(244, 63, 94, 0.3)'
        }}
      >
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <AlertTriangle style={{ width: '24px', height: '24px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Reject Leave Request</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Applicant: {request.userName}</p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f87171', padding: '10px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Reason for Rejection (Mandatory)
            </label>
            <textarea 
              id="input-rejection-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this request is being rejected..."
              rows={3}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button 
              id="btn-confirm-rejection"
              type="submit" 
              disabled={submitting}
              className="btn btn-danger btn-sm"
            >
              <span>{submitting ? 'Rejecting...' : 'Confirm Rejection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
