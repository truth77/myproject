import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiStar } from 'react-icons/fi';
import MobileToolCard from './MobileToolCard';

// Add styles for button hover effects
const buttonHoverStyle = {
  '&:hover': {
    filter: 'brightness(1.1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
  },
  '&:active': {
    transform: 'translateY(0)',
    filter: 'brightness(0.95)'
  }
};

const ToolsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    cuerise: false,
    biblical: false
  });

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleHover = (toolId, isHovering) => {
    setHoverStates(prev => ({
      ...prev,
      [toolId]: isHovering
    }));
  };

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
      id: 'biblical-geocentric',
      title: 'Biblical Geocentric Model',
      tagline: 'Discover the Universe Through Scripture',
      description: 'Explore the Biblically accurate geocentric model of the universe, revealing the cosmos as described in Scripture with Earth at the center of God\'s creation.',
      features: [
        'Interactive 3D model of the Biblical cosmos',
        'Scripture-based celestial mapping',
        'Historical context and explanations',
        'Comparison with modern cosmology',
        'Educational resources for study'
      ],
      whoItsFor: [
        'Bible Scholars',
        'Theology Students',
        'Christian Educators',
        'Creation Scientists'
      ],
      cta: 'Become a True Scientist',
      ctaSubtext: '— 1 Thessalonians 5:21 "Test all things. Hold fast to what is good."',
      ctaLink: '/biblical-geocentric',
      logo: '/images/Biblical-Geocentric-Universe.png',
      image: '/images/geocentric-preview.jpg',
      accentColor: '#8B4513', // Earthy brown
      secondaryColor: '#4169E1', // Royal blue
      gradient: 'linear-gradient(135deg, #8B4513 0%, #4169E1 100%)',
      isFeatured: true
    }
  ];

  // Check if mobile view should be shown (768px or below)
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Wait for client-side rendering
  if (!isClient) {
    return <div style={{ minHeight: '100vh' }} />;
  }

  // Render mobile view for screens 768px or below
  if (isMobile) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: '#111827', margin: '0.5rem 0 1rem', fontWeight: '800', lineHeight: '1.2' }}>
            Special Tools For Growth
          </h1>
          <p style={{ fontSize: '1rem', color: '#4B5563', maxWidth: '500px', margin: '0 auto', lineHeight: '1.5' }}>
            Discover our powerful tools designed to help you advance in many different areas of life.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {tools.map((tool) => (
            <MobileToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    );
  }

  // Render desktop view
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#111827', margin: '0.5rem 0 1rem', fontWeight: '800', lineHeight: '1.2', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          Special Tools For Growth
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#4B5563', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Discover our powerful tools designed to help you advance in many different areas of life.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto', padding: '0 1rem', position: 'relative', width: '100%', boxSizing: 'border-box', alignItems: 'center' }}>
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
              width: '100%',
              maxWidth: '1000px',
              margin: '0 auto',
              '@media (max-width: 1024px)': {
                flexDirection: 'column',
                maxWidth: '600px'
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
              padding: '5.5rem 3rem 3rem 3rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              boxSizing: 'border-box',
              '@media (max-width: 1024px)': {
                padding: '4.5rem 2rem 2rem 2rem',
                order: 2
              }
            }}>
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                fontSize: '4rem',
                fontWeight: '800',
                color: tool.id === 'cuerise' ? '#F3F4F6' : '#F3F4F6',
                lineHeight: 1,
                zIndex: 1,
                pointerEvents: 'none',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                '@media (max-width: 768px)': {
                  fontSize: '3rem',
                  top: '1rem',
                  left: '1rem',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)'
                }
              }}>
                {tool.id === 'cuerise' ? '#1' : '#2'}
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
                    fontWeight: tool.id === 'biblical-geocentric' ? '600' : '700',
                    color: '#111827',
                    marginBottom: tool.id === 'biblical-geocentric' ? '1rem' : '1.25rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '2px solid #E5E7EB',
                    display: 'inline-block'
                  }}>
                    {tool.id === 'biblical-geocentric' ? 'Features That Awaken Bible Truths' : 'Features That Empower Your Message'}
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
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        color: '#4B5563'
                      }}>
                        <FiCheck 
                          size={18} 
                          style={{
                            color: tool.accentColor,
                            flexShrink: 0,
                            marginTop: '0.2rem'
                          }} 
                        />
                        {feature}
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
                    to="/register"
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
                    <button 
                      style={{
                        backgroundColor: tool.accentColor,
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        zIndex: 1,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                        e.currentTarget.style.boxShadow = `0 5px 15px ${tool.accentColor}80`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.filter = 'none';
                        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.filter = 'brightness(0.95)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }}
                    >
                      {tool.id === 'biblical-geocentric' ? 'Start using the Biblical Geocentric model today' : 'Start using CueRise today'}
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
                  alt={tool.id === 'cuerise' ? 'CueRise Logo' : 'Biblical Geocentric Logo'}
                  style={{
                    height: '225px',
                    width: 'auto',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    borderRadius: tool.id === 'biblical-geocentric' ? '20px' : '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      transform: 'scale(1.05)'
                    },
                    '@media (max-width: 768px)': {
                      height: '180px',
                      borderRadius: tool.id === 'biblical-geocentric' ? '16px' : '0'
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
                  <Link 
                    to="/register"
                    style={{
                      backgroundColor: hoverStates[tool.id] ? 'white' : 'rgba(255, 255, 255, 0.95)',
                      padding: '2rem',
                      borderRadius: '16px',
                      boxShadow: hoverStates[tool.id] 
                        ? `0 15px 30px -5px ${tool.accentColor}60` 
                        : `0 6px 12px -2px ${tool.accentColor}20`,
                      maxWidth: '90%',
                      margin: '0 auto',
                      textAlign: 'center',
                      display: 'block',
                      textDecoration: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: hoverStates[tool.id] 
                        ? 'translateY(-6px) scale(1.02)' 
                        : 'translateY(0) scale(1)',
                      border: `1px solid ${tool.accentColor}${hoverStates[tool.id] ? '30' : '20'}`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={() => handleHover(tool.id, true)}
                    onMouseLeave={() => handleHover(tool.id, false)}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${tool.accentColor}, ${tool.secondaryColor})`,
                      transform: hoverStates[tool.id] ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      marginBottom: '1.25rem',
                      lineHeight: '1.3',
                      background: `linear-gradient(135deg, ${tool.accentColor} 0%, ${tool.secondaryColor} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                      position: 'relative',
                      paddingBottom: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}>
                      {tool.id === 'cuerise' ? 'Ready to Rise?' : 'Ready to Explore?'}
                    </h3>
                    <p style={{
                      fontSize: '1.05rem',
                      color: '#4B5563',
                      lineHeight: '1.7',
                      margin: hoverStates[tool.id] ? '1.5rem 0 1.75rem' : '1.25rem 0 1.5rem',
                      padding: '0 1rem',
                      transition: 'all 0.3s ease'
                    }}>
                      {tool.id === 'cuerise' 
                        ? 'Start using CueRise today — your message deserves it.'
                        : 'Discover the Biblical perspective on the universe.'}
                    </p>
                  </Link>
                  
                  {/* Video Container */}
                  <div style={{
                    marginTop: '2rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${tool.accentColor}20`
                  }}>
                    <h4 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      color: '#111827',
                      textAlign: 'center'
                    }}>
                      {tool.id === 'cuerise' ? 'See CueRise in Action' : 'Watch the Explanation'}
                    </h4>
                    <div style={{
                      position: 'relative',
                      paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                      height: 0,
                      overflow: 'hidden',
                      borderRadius: '12px',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}>
                      {tool.id === 'cuerise' 
                        ? 'CueRise Demo Video'
                        : 'Biblical Geocentric Explanation Video'}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '60px',
                        height: '60px',
                        backgroundColor: `${tool.accentColor}20`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)'
                      }}>
                        <div style={{
                          width: 0,
                          height: 0,
                          borderTop: '15px solid transparent',
                          borderLeft: `25px solid ${tool.accentColor}`,
                          borderBottom: '15px solid transparent',
                          marginLeft: '5px'
                        }} />
                      </div>
                    </div>
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
