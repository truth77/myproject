import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';

const Home = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="home" style={{ padding: '1rem', flex: '1' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '2rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#2c3e50',
          marginBottom: '1rem',
          lineHeight: 1.2,
          padding: '0 1rem'
        }}>
          Welcome to ARK Academy
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#7f8c8d',
          maxWidth: '700px',
          margin: '0 auto 1.5rem',
          lineHeight: 1.6,
          padding: '0 1rem'
        }}>
          Our mission is to edify your life and family, equip you with helpful resources, 
          and encourage you to fulfill your eternal purpose in Christ Jesus.
        </p>
        
        {!isAuthenticated && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px',
            marginTop: '24px',
            flexWrap: 'wrap' 
          }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#2c3e50',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                border: '2px solid #2c3e50'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#4ba1a4';
                e.currentTarget.style.borderColor = '#4ba1a4';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#2c3e50';
                e.currentTarget.style.borderColor = '#2c3e50';
              }}
            >
              Get Started
            </Link>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                color: '#2c3e50',
                border: '2px solid #2c3e50',
                padding: '10px 24px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#4ba1a4';
                e.currentTarget.style.borderColor = '#4ba1a4';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#2c3e50';
                e.currentTarget.style.color = '#2c3e50';
              }}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '2rem',
          fontSize: '2rem'
        }}>
          Our Services
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          padding: '0 1rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            {
              title: 'Bible Study',
              description: 'Dive deep into the Word with our comprehensive Bible study resources.',
              path: '/bible',
              icon: '📖'
            },
            {
              title: 'Prayer Network',
              description: 'Join our global prayer community and submit your prayer requests.',
              path: '/prayer',
              icon: '🙏'
            },
            {
              title: 'Online Courses',
              description: 'Enhance your spiritual growth with our structured courses.',
              path: '/class',
              icon: '🎓'
            },
            {
              title: 'Live Services',
              description: 'Participate in our live worship and teaching sessions.',
              path: '/live',
              icon: '⛪'
            },
            {
              title: 'Church Planting',
              description: 'Learn about our mission to plant churches worldwide.',
              path: '/plant',
              icon: '🌍'
            },
            {
              title: 'Library Resources',
              description: 'Access our digital library of books, articles, and study materials.',
              path: '/library',
              icon: '📚'
            }
          ].map((service, index) => (
            <div key={index} style={{ display: 'flex' }}>
              <ServiceCard 
                title={service.title}
                description={service.description}
                path={service.path}
                icon={service.icon}
                isAuthenticated={isAuthenticated}
                color={service.color}
              />
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '3rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          marginBottom: '1.5rem',
          fontSize: '2rem'
        }}>
          About ARK Network
        </h2>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          textAlign: 'center',
          color: '#555',
          lineHeight: '1.6'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            ARK Network is dedicated to spreading the Gospel and building a community of believers 
            who are passionate about growing in their faith and making disciples of all nations.
          </p>
          <p>
            Our mission is to provide accessible, high-quality biblical teaching and resources 
            to help you deepen your relationship with God and fulfill your God-given purpose.
          </p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer style={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(/images/YHWH-ARK-Network.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: 'white',
      padding: '2rem 1rem',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      marginTop: '3rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1.5rem',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '1rem'
        }}>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: 'white',
              opacity: '0.8',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <FacebookIcon />
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: 'white',
              opacity: '0.8',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <YouTubeIcon />
          </a>
          <a 
            href="mailto:contact@example.com"
            style={{
              color: 'white',
              opacity: '0.8',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            <EmailIcon />
          </a>
        </div>
        <div style={{
          marginTop: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.9rem',
          opacity: '0.8',
          width: '100%'
        }}>
          &copy; {new Date().getFullYear()} ARK Network. All rights reserved.
        </div>
      </div>
    </footer>
    </div>
  );
};

const ServiceCard = ({ title, description, path, icon, isAuthenticated, color }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const glowColors = {
    'Bible Study': 'rgba(52, 152, 219, 0.6)',
    'Prayer Network': 'rgba(241, 196, 15, 0.6)', // Changed to gold
    'Online Courses': 'rgba(168, 85, 247, 0.6)',
    'Live Services': 'rgba(231, 76, 60, 0.6)',
    'Church Planting': 'rgba(46, 204, 113, 0.6)', // Changed to green
    'Library Resources': 'rgba(139, 69, 19, 0.6)' // Brown color for Library
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: isHovered 
      ? `0 0 15px 5px ${glowColors[title] || 'rgba(0,0,0,0.1)'}` 
      : '0 2px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-5px)'
    },
    '@media (max-width: 600px)': {
      '&:hover': {
        transform: 'none'
      }
    }
  };

  // Always use the provided path without authentication check
  return (
    <Link 
      to={path}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={cardStyle}>
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: isHovered ? glowColors[title] || '#2c3e50' : 'transparent',
          transition: 'all 0.3s ease'
        }} />
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: '0.5rem',
          height: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '1rem',
            lineHeight: 1,
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}>
            {icon}
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            textAlign: 'center',
            marginBottom: '1rem',
            fontWeight: 600,
            transition: 'color 0.3s ease',
            color: isHovered ? glowColors[title] || '#2c3e50' : '#2c3e50'
          }}>
            {title}
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#7f8c8d',
            textAlign: 'center',
            marginBottom: '1.5rem',
            flexGrow: 1,
            lineHeight: 1.6
          }}>
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Home;
