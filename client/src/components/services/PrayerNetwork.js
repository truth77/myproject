import React, { useState } from 'react';

const PrayerNetwork = () => {
  const [prayerRequest, setPrayerRequest] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState([
    { id: 1, text: 'Pray for healing for my mother who is recovering from surgery.', date: '2 hours ago' },
    { id: 2, text: 'Pray for wisdom and guidance in my new job opportunity.', date: '5 hours ago' },
    { id: 3, text: 'Pray for peace in our community during these challenging times.', date: '1 day ago' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prayerRequest.trim()) {
      const newRequest = {
        id: Date.now(),
        text: prayerRequest,
        date: 'Just now'
      };
      setRequests([newRequest, ...requests]);
      setPrayerRequest('');
      setSubmitted(true);
      
      // Reset submission message after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Prayer Network</h1>
      
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Submit a Prayer Request</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
              placeholder="Share your prayer request..."
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical',
                minHeight: '100px',
                fontFamily: 'inherit'
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#2c3e50',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#1a252f'
              }
            }}
          >
            Submit Request
          </button>
          {submitted && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              Your prayer request has been submitted. Our community is praying for you.
            </div>
          )}
        </form>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Prayer Requests</h2>
        {requests.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {requests.map((request) => (
              <div 
                key={request.id}
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  borderLeft: '4px solid #2c3e50',
                  position: 'relative'
                }}
              >
                <p style={{ margin: '0 0 0.5rem 0', lineHeight: '1.5' }}>{request.text}</p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#7f8c8d',
                  fontSize: '0.875rem'
                }}>
                  <span>{request.date}</span>
                  <button 
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3498db',
                      cursor: 'pointer',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    I'm praying for this
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem 0' }}>
            No prayer requests yet. Be the first to share your prayer need.
          </p>
        )}
      </div>
    </div>
  );
};

export default PrayerNetwork;
