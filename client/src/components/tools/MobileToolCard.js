import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { Link } from 'react-router-dom';

const MobileToolCard = ({ tool }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="mobile-tool-card" style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto 2rem',
      perspective: '1000px'
    }}>
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
        flipSpeedBackToFront={0.5}
        flipSpeedFrontToBack={0.5}
      >
        {/* Front of Card */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
            border: '1px solid #e5e7eb'
          }}
          onClick={handleClick}
        >
          <img 
            src={tool.logo} 
            alt={`${tool.title} Logo`}
            style={{
              height: '120px',
              width: 'auto',
              marginBottom: '1rem',
              borderRadius: tool.id === 'biblical-geocentric' ? '12px' : '0',
            }}
          />
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            margin: '0.5rem 0',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${tool.accentColor} 0%, ${tool.secondaryColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {tool.title}
          </h3>
          <p style={{
            color: '#4B5563',
            textAlign: 'center',
            margin: '0.5rem 0 1rem',
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}>
            {tool.tagline}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: tool.accentColor,
            fontWeight: '600',
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb',
            width: '100%',
            justifyContent: 'center'
          }}>
            <span>Learn More</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '0.5rem' }}>
              <path d="M9 18L15 12L9 6" stroke={tool.accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Back of Card */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            border: `1px solid ${tool.accentColor}20`,
            position: 'relative'
          }}
          onClick={handleClick}
        >
          <h4 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            margin: '0 0 1rem',
            color: '#111827',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${tool.accentColor} 0%, ${tool.secondaryColor} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            paddingBottom: '0.5rem',
            borderBottom: `2px solid ${tool.accentColor}20`
          }}>
            {tool.id === 'cuerise' ? 'About CueRise' : 'About Biblical Geocentric'}
          </h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <p style={{
              color: '#4B5563',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              {tool.description}
            </p>
            
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '1rem 0'
            }}>
              {tool.features.slice(0, 3).map((feature, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#4B5563'
                }}>
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: `${tool.accentColor}20`,
                    color: tool.accentColor,
                    textAlign: 'center',
                    lineHeight: '20px',
                    marginRight: '0.5rem',
                    flexShrink: 0,
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <Link 
            to="/register"
            style={{
              backgroundColor: tool.accentColor,
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: '600',
              marginTop: 'auto',
              display: 'block',
              transition: 'all 0.2s ease',
              ':hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${tool.accentColor}40`
              },
              ':active': {
                transform: 'translateY(0)'
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {tool.id === 'cuerise' ? 'Try CueRise Now' : 'Explore the Model'}
          </Link>
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default MobileToolCard;
