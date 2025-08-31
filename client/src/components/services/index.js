import React from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

// Common SubscriptionGate component for all services
const SubscriptionGate = ({ children, serviceName, color, description, icon }) => {
  const { isSubscribed } = useSubscription();
  const navigate = useNavigate();

  if (isSubscribed) {
    return children;
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        fontSize: '36px'
      }}>
        {icon}
      </div>
      <h2 style={{
        color: color,
        marginBottom: '1rem',
        fontSize: '2rem',
        fontWeight: '700'
      }}>
        {serviceName}
      </h2>
      <p style={{
        color: '#4b5563',
        fontSize: '1.1rem',
        lineHeight: '1.7',
        marginBottom: '2rem',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        {description}
      </p>
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '1.5rem',
        borderRadius: '12px',
        margin: '2rem 0',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          color: '#1f2937',
          marginBottom: '1rem',
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          🔒 Premium Content Locked
        </h3>
        <p style={{
          color: '#6b7280',
          marginBottom: '1.5rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Subscribe now to unlock full access to {serviceName} and all other premium content.
        </p>
        <button
          onClick={() => navigate('/subscribe')}
          style={{
            backgroundColor: color,
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: `0 4px 6px ${color}40`,
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 12px ${color}60`
            }
          }}
        >
          Subscribe Now
        </button>
      </div>
      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: 'transparent',
          color: color,
          border: `2px solid ${color}40`,
          padding: '0.5rem 1.5rem',
          borderRadius: '6px',
          fontSize: '0.95rem',
          fontWeight: '500',
          cursor: 'pointer',
          marginTop: '1rem',
          transition: 'all 0.2s',
          ':hover': {
            backgroundColor: `${color}10`
          }
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
};

// Bible Study Component
export const BibleStudy = () => (
  <SubscriptionGate
    serviceName="Bible Study Hub"
    description="Dive deep into scripture with our comprehensive study tools, commentaries, and study plans to help you understand God's Word on a deeper level."
    color="#4f46e5"
    icon="📖"
  >
    <div style={{ padding: '2rem' }}>
      <h1>Bible Study Hub</h1>
      <p>Welcome to the full Bible Study experience!</p>
      {/* Add actual Bible study content here */}
    </div>
  </SubscriptionGate>
);

// Prayer Network Component
export const PrayerNetwork = () => (
  <SubscriptionGate
    serviceName="Prayer Network"
    description="Join our global prayer community, submit prayer requests, and pray for others in our supportive and confidential prayer network."
    color="#10b981"
    icon="🙏"
  >
    <div style={{ padding: '2rem' }}>
      <h1>Prayer Network</h1>
      <p>Welcome to our prayer community!</p>
      {/* Add actual prayer network content here */}
    </div>
  </SubscriptionGate>
);

// Online Courses Component
export const OnlineCourses = () => (
  <SubscriptionGate
    serviceName="Online Courses"
    description="Enroll in our faith-based courses taught by biblical scholars and spiritual leaders to grow in knowledge and deepen your faith."
    color="#f59e0b"
    icon="🎓"
  >
    <div style={{ padding: '2rem' }}>
      <h1>Online Courses</h1>
      <p>Browse our course catalog!</p>
      {/* Add actual courses content here */}
    </div>
  </SubscriptionGate>
);

// Live Services Component
export const LiveServices = () => (
  <SubscriptionGate
    serviceName="Live Services"
    description="Watch live and recorded worship services, sermons, and special events from Ark Network Academy's community."
    color="#ef4444"
    icon="⛪"
  >
    <div style={{ padding: '2rem' }}>
      <h1>Live Services</h1>
      <p>Watch our services live or on-demand!</p>
      {/* Add actual live services content here */}
    </div>
  </SubscriptionGate>
);
