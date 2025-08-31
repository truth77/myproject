import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiStar } from 'react-icons/fi';

const ToolsPage = () => {
  const [activeTool, setActiveTool] = useState('cuerise');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // This should come from your auth context/state

  const tools = [
    {
      id: 'cuerise',
      title: 'CueRise',
      tagline: 'Speak With Confidence. Rise With Purpose.',
      description: 'All-in-one teleprompter, speech editor, and delivery toolkit for speakers who mean business.',
      features: [
        'Smart Teleprompter – Scrolls at your pace, or moves with your voice',
        'Live or Recorded – Perfect for sermons, keynotes, and content creation',
        'Slide-Sync – Link your PowerPoint/Google Slides to your teleprompter',
        'Remote Control – Use a clicker to stay hands-free and on track',
        'Visual Speech Editor – Create, revise, and rehearse in a distraction-free workspace',
        'Export Options – Save as HTML, PDF, or share your notes with your team'
      ],
      whoItsFor: [
        'Preachers & Teachers',
        'Educators & Coaches',
        'Motivational Speakers',
        'Content Creators & Podcasters'
      ],
      cta: 'Start using CueRise today',
      ctaSubtext: '— your message deserves it.',
      ctaLink: 'https://cuerise.com',
      logo: '/images/CueRise-Logo.png',
      image: '/images/cuerise-preview.jpg',
      accentColor: '#3B82F6', // Blue from CueRise logo
      secondaryColor: '#10B981', // Green from CueRise logo
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)',
      isFeatured: true
    },
    {
      id: 'geocentric',
      title: 'GeoCentric Models',
      tagline: 'Mapping the Future with Precision',
      description: 'Advanced geospatial analysis and modeling tools to help you understand and visualize location-based data with precision and clarity.',
      features: [
        'Interactive 3D mapping and visualization',
        'Real-time geospatial data processing',
        'Custom location analytics and reporting',
        'Terrain and elevation modeling',
        'Multi-layer data integration'
      ],
      whoItsFor: [
        'Researchers',
        'Urban Planners',
        'Environmental Scientists',
        'GIS Specialists'
      ],
      cta: 'Explore GeoCentric Models',
      ctaSubtext: '— transform your spatial data into insights.',
      ctaLink: 'https://geocentric-models.com/start',
      logo: '/images/geocentric-logo.png',
      image: '/images/geocentric-preview.jpg',
      accentColor: '#10B981', // Green from GeoCentric logo
      secondaryColor: '#059669', // Secondary color from GeoCentric logo
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      isFeatured: true
    }
  ];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '4rem 1rem',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{
          fontSize: '3rem',
          color: '#111827',
          margin: '0.5rem 0 1rem',
          fontWeight: '800',
          lineHeight: '1.2',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Advanced Tools For Growth
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#4B5563',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Discover our powerful tools designed to help you advance in many different areas of life.
        </p>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 1rem',
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        alignItems: 'center'
      }}>
        {tools.map((tool) => (
          <div 
            key={tool.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              border: '1px solid #E5E7EB',
              '@media (max-width: 1024px)': {
                flexDirection: 'column',
                maxWidth: '600px',
                margin: '0 auto'
              },
              ...(tool.isFeatured && {
                border: `1px solid ${tool.accentColor}20`,
                boxShadow: `0 0 0 1px ${tool.accentColor}20, 0 10px 25px -5px rgba(79, 70, 229, 0.1), 0 8px 10px -6px rgba(79, 70, 229, 0.1)`
              })
            }}
          >
            {/* Content Side */}
            <div style={{
              flex: '0 0 55%',
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              boxSizing: 'border-box',
              '@media (max-width: 1024px)': {
                padding: '2rem',
                order: 2
              }
            }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                fontSize: '4rem',
                fontWeight: '800',
                color: '#F3F4F6',
                lineHeight: 1,
                zIndex: 1,
                pointerEvents: 'none',
                '@media (max-width: 768px)': {
                  fontSize: '3rem',
                  top: '1rem',
                  left: '1rem'
                }
              }}>
                #1
              </div>
              
              {tool.isFeatured && (
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  backgroundColor: `${tool.accentColor}10`,
                  color: tool.accentColor,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  border: `1px solid ${tool.accentColor}20`,
                  zIndex: 2
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: tool.accentColor,
                    borderRadius: '50%',
                    display: 'inline-block'
                  }}></span>
                  Featured Tool
                </div>
              )}
              
              <h2 style={{
                fontSize: '2.25rem',
                color: '#111827',
                margin: '0 0 1.5rem',
                fontWeight: '800',
                lineHeight: '1.2',
                '@media (max-width: 768px)': {
                  fontSize: '1.75rem'
                }
              }}>
                {tool.title}
              </h2>
              
              <p style={{
                fontSize: '1.25rem',
                color: '#4B5563',
                margin: '0 0 3rem',
                lineHeight: '1.7',
                maxWidth: '90%',
                fontWeight: '500',
                '@media (max-width: 768px)': {
                  fontSize: '1.1rem',
                  maxWidth: '100%',
                  marginBottom: '2rem'
                }
              }}>
                {tool.description}
              </p>
              
              {tool.features && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    color: '#111827',
                    fontWeight: '700',
                    margin: '0 0 1.25rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '2px solid #E5E7EB',
                    display: 'inline-block'
                  }}>
                    Features That Empower Your Message
                  </h3>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 2rem',
                    display: 'grid',
                    gap: '0.75rem',
                    textAlign: 'left',
                    paddingLeft: '1.5rem'
                  }}>
                    {tool.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        fontSize: '1rem',
                        color: '#4B5563',
                        lineHeight: '1.5'
                      }}>
                        <FiCheck style={{
                          color: tool.accentColor,
                          minWidth: '20px',
                          marginTop: '0.25rem',
                          flexShrink: 0
                        }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {tool.whoItsFor && (
                <div style={{ 
                  margin: '2.5rem 0',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    color: '#111827',
                    fontWeight: '700',
                    margin: '0 auto 1rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '2px solid #E5E7EB',
                    display: 'inline-block',
                    textAlign: 'center'
                  }}>
                    Who It's For
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '0.75rem',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    {[...tool.whoItsFor, 'Students'].map((who, index) => (
                      <span 
                        key={index} 
                        style={{
                          backgroundColor: `${tool.accentColor}10`,
                          color: tool.accentColor,
                          padding: '0.4rem 0.9rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      >
                        <FiStar size={14} style={{ fill: tool.accentColor, color: tool.accentColor }} />
                        {who}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginTop: 'auto',
                paddingTop: '1.5rem',
                borderTop: '1px solid #E5E7EB'
              }}>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#4B5563',
                  margin: '0 0 0.5rem',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  {tool.ctaSubtext}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  <Link 
                    to={isAuthenticated ? "/cuerise" : "http://localhost:3002/register"}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      width: 'fit-content',
                      '@media (max-width: 768px)': {
                        width: '100%',
                        maxWidth: '300px'
                      }
                    }}
                  >
                    <button style={{
                      backgroundColor: tool.accentColor,
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s ease',
                      width: '100%',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }
                    }}>
                      {isAuthenticated ? 'Go to CueRise' : 'Start using CueRise today'}
                      <FiArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Image Side */}
            <div style={{
              flex: '0 0 45%',
              minHeight: '500px',
              backgroundImage: `linear-gradient(135deg, ${tool.accentColor} 0%, ${tool.secondaryColor} 100%)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              boxSizing: 'border-box',
              '@media (max-width: 1024px)': {
                minHeight: '300px',
                order: 1
              }
            }}>
              {/* Pattern Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("/images/cuerise-pattern.svg")',
                backgroundSize: 'cover',
                opacity: 0.1,
                zIndex: 1
              }} />

              {/* CueRise Logo */}
              <div style={{
                position: 'absolute',
                top: '2rem',
                left: 0,
                right: 0,
                zIndex: 10,
                textAlign: 'center',
                width: '100%',
                '@media (max-width: 768px)': {
                  top: '1.5rem'
                }
              }}>
                <img 
                  src={tool.logo} 
                  alt="CueRise Logo" 
                  style={{
                    height: '100px',
                    width: 'auto',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    '@media (max-width: 768px)': {
                      height: '80px'
                    }
                  }}
                />
              </div>

              {/* Content Overlay */}
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                color: 'white',
                textAlign: 'center',
                '@media (max-width: 768px)': {
                  padding: '1.5rem'
                }
              }}>
                <div style={{
                  maxWidth: '400px',
                  zIndex: 3,
                  width: '100%',
                  padding: '0 1rem'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    maxWidth: '90%',
                    margin: '0 auto',
                    textAlign: 'center'
                  }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      lineHeight: '1.3',
                      color: tool.accentColor,
                      background: `linear-gradient(135deg, ${tool.accentColor} 0%, ${tool.secondaryColor} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}>
                      Ready to Elevate Your Message?
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      color: '#4B5563',
                      lineHeight: '1.6',
                      marginBottom: '1.5rem'
                    }}>
                      Join ministers, educators, and speakers who trust CueRise to help them deliver powerful, impactful messages every time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
