import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const LibraryResources = ({ splash = false }) => {
  const { isAuthenticated } = useAppContext();
  const [hoveredCard, setHoveredCard] = useState(null);

  if (!splash) {
    return (
      <div className="library-dashboard">
        <h1>Library Dashboard</h1>
        <p>Welcome to your library dashboard. Access all your saved resources here.</p>
        {!isAuthenticated && (
          <div className="auth-prompt">
            <p>Please sign in to access the full library.</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="library-splash" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '3rem 2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1.5rem',
          color: '#6c5ce7'
        }}>
          📚
        </div>
        
        <h1 style={{
          fontSize: '2.5rem',
          color: '#2d3436',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          Library Resources
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#636e72',
          maxWidth: '700px',
          margin: '0 auto 2rem',
          lineHeight: '1.6'
        }}>
          Explore our extensive collection of digital resources including books, articles, 
          study guides, and more to support your spiritual growth and learning journey.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          margin: '3rem 0',
          padding: '0 1rem'
        }}>
          {[
            {
              title: 'E-Books',
              description: 'Access our growing collection of Christian literature',
              icon: '📖',
              path: '/library/ebook'
            },
            {
              title: 'Homeschool Help',
              description: 'Resources and guides to support Christian homeschooling families',
              icon: '🏫',
              path: '/library/homeschool'
            },
            {
              title: 'Audio/Video',
              description: 'Sermons, lectures, and teaching series',
              icon: '🎧',
              path: '/library/av'
            },
            {
              title: 'Devotionals',
              description: 'Daily readings and reflections',
              icon: '🙏',
              path: '/library/devo'
            },
            {
              title: 'Articles',
              description: 'In-depth articles on faith and theology',
              icon: '📄',
              path: '/library/article'
            },
            {
              title: 'Special Tools',
              description: 'Helpful tools and resources for your growth',
              icon: '🛠️',
              path: '/library/tool'
            }
          ].map((feature, index) => {
            const isHovered = hoveredCard === index;
            const glowColor = 'rgba(139, 69, 19, 0.6)'; // Brown color for all cards
            
            const cardStyle = {
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: isHovered 
                ? `0 0 15px 5px ${glowColor}` 
                : '0 2px 10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
              ':hover': {
                transform: 'translateY(-5px)'
              },
              '@media (max-width: 600px)': {
                ':hover': {
                  transform: 'none'
                }
              }
            };
            
            return (
              <div key={index} style={cardStyle}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}>
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: isHovered ? glowColor : 'transparent',
                  transition: 'all 0.3s ease'
                }} />
                <Link 
                  to={feature.path} 
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1
                  }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                marginBottom: '0.5rem',
                color: '#2d3436'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#636e72',
                fontSize: '0.95rem',
                margin: 0
              }}>
                {feature.description}
              </p>
                </Link>
              </div>
            );
          })}
        </div>
        
        <div style={{ marginTop: '2rem' }}>
          {isAuthenticated ? (
            <Link 
              to="/library/dashboard"
              style={{
                display: 'inline-block',
                backgroundColor: '#6c5ce7',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                ':hover': {
                  backgroundColor: '#5649c0',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Go to Library
            </Link>
          ) : (
            <div>
              <Link 
                to="/register"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#6c5ce7',
                  color: 'white',
                  padding: '0.75rem 2rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  margin: '0 0.5rem 1rem',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    backgroundColor: '#5649c0',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Get Started
              </Link>
              <Link 
                to="/login"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'transparent',
                  color: '#6c5ce7',
                  border: '2px solid #6c5ce7',
                  padding: '0.75rem 2rem',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  margin: '0 0.5rem',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    backgroundColor: '#f3f1ff',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        padding: '2rem',
        marginTop: '2rem',
        textAlign: 'left'
      }}>
        <h2 style={{
          fontSize: '1.75rem',
          color: '#2d3436',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Featured Resources
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            {
              title: 'Bible Study Tools',
              description: 'Access various Bible translations, commentaries, and study tools',
              link: '/bible'
            },
            {
              title: 'Sermon Archive',
              description: 'Browse through our collection of past sermons and teachings',
              link: '/live'
            },
            {
              title: 'Prayer Resources',
              description: 'Find guides and materials to enhance your prayer life',
              link: '/prayer'
            }
          ].map((resource, index) => (
            <Link 
              key={index} 
              to={resource.link}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.3s ease',
                border: '1px solid #e0e0e0',
                ':hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }
              }}
            >
              <h3 style={{
                color: '#6c5ce7',
                marginBottom: '0.5rem',
                fontSize: '1.25rem'
              }}>
                {resource.title}
              </h3>
              <p style={{
                color: '#636e72',
                margin: 0,
                fontSize: '0.95rem'
              }}>
                {resource.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryResources;
