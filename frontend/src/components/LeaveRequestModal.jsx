import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function LeaveRequestModal({ isOpen, onClose, userBalances, onRequestSubmitted }) {
  const [leaveType, setLeaveType] = useState('ANNUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationType, setDurationType] = useState('FULL_DAY');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Default start and end date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setStartDate(dateStr);
    setEndDate(dateStr);
    setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate estimated days count
  let calculatedDays = 0;
  if (startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && s <= e) {
      const diffTime = Math.abs(e - s);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      calculatedDays = (durationType === 'FIRST_HALF' || durationType === 'SECOND_HALF') ? 0.5 : diffDays;
    }
  }

  const selectedBalance = userBalances ? userBalances[leaveType] : null;
  const isInsufficient = selectedBalance && calculatedDays > selectedBalance.available;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (calculatedDays <= 0) {
      setError('Start date cannot be after end date.');
      return;
    }

    if (isInsufficient) {
      setError(`Insufficient ${leaveType} leave balance. Requested ${calculatedDays} day(s), but only ${selectedBalance.available} day(s) available.`);
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('leaveflow_token');

    try {
      const res = await fetch('/api/leave/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          leaveType,
          startDate,
          endDate,
          durationType,
          reason
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit leave request');
      }

      onClose();
      if (onRequestSubmitted) onRequestSubmitted(data.request);
    } catch (err) {
      setError(err.message);
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
          maxWidth: '520px',
          padding: '32px',
          position: 'relative',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
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

        <h2 style={{ fontSize: '1.4rem', marginBottom: '6px', color: '#ffffff' }}>
          Submit <span style={{ color: '#3b82f6' }}>Leave Request</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
          Specify your leave dates, duration mode, and reason for review
        </p>

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
            id="leave-request-error-alert"
          >
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Leave Category Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Leave Type
            </label>
            <select
              id="select-leave-type"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="ANNUAL">Annual Leave ({userBalances?.ANNUAL?.available || 0} days remaining)</option>
              <option value="CASUAL">Casual Leave ({userBalances?.CASUAL?.available || 0} days remaining)</option>
              <option value="SICK">Sick Leave ({userBalances?.SICK?.available || 0} days remaining)</option>
            </select>
          </div>

          {/* Date Picker Range */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                Start Date
              </label>
              <input 
                id="input-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
                End Date
              </label>
              <input 
                id="input-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Duration Mode Option (Full Day / Half Day) */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Duration Mode
            </label>
            <select
              id="select-duration-type"
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="FULL_DAY">Full Day (1.0 day/day)</option>
              <option value="FIRST_HALF">First Half (0.5 day - Morning)</option>
              <option value="SECOND_HALF">Second Half (0.5 day - Afternoon)</option>
            </select>
          </div>

          {/* Reason Input */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '6px' }}>
              Reason for Request
            </label>
            <textarea 
              id="input-leave-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context for manager review..."
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

          {/* Calculation Summary Preview */}
          <div 
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Days Required:</span>
            </div>
            <span id="calculated-days-preview" style={{ fontSize: '1rem', fontWeight: 700, color: isInsufficient ? '#f87171' : '#34d399' }}>
              {calculatedDays} Day(s)
            </span>
          </div>

          <button 
            id="btn-submit-request"
            type="submit" 
            disabled={submitting || isInsufficient}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px' }}
          >
            <span>{submitting ? 'Submitting...' : 'Submit Request for Approval'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
