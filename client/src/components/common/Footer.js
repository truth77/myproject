import React from 'react';
import { Box } from '@mui/material';
import VersionDisplay from './VersionDisplay';

const Footer = () => {
  return (
    <Box component="footer" sx={{
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/images/YHWH-ARK-Network.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      color: 'white',
      padding: '2rem 1rem',
      borderTopLeftRadius: '12px',
      borderTopRightRadius: '12px',
      marginTop: '3rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Box sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1.5rem',
        padding: '0 2rem'
      }}>
        <Box sx={{
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
              opacity: 0.8,
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg 
              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" 
              focusable="false" 
              aria-hidden="true" 
              viewBox="0 0 24 24" 
              data-testid="FacebookIcon"
              style={{
                width: '24px',
                height: '24px',
                fill: 'currentColor'
              }}
            >
              <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"></path>
            </svg>
          </a>
          
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{
              color: 'white',
              opacity: 0.8,
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg 
              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" 
              focusable="false" 
              aria-hidden="true" 
              viewBox="0 0 24 24" 
              data-testid="YouTubeIcon"
              style={{
                width: '24px',
                height: '24px',
                fill: 'currentColor'
              }}
            >
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"></path>
            </svg>
          </a>
          
          <a 
            href="mailto:contact@example.com" 
            style={{
              color: 'white',
              opacity: 0.8,
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <svg 
              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" 
              focusable="false" 
              aria-hidden="true" 
              viewBox="0 0 24 24" 
              data-testid="EmailIcon"
              style={{
                width: '24px',
                height: '24px',
                fill: 'currentColor'
              }}
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"></path>
            </svg>
          </a>
        </Box>
        
        <Box sx={{
          marginTop: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.9rem',
          opacity: 0.8,
          width: '100%'
        }}>
          {new Date().getFullYear()} ARK Network. All rights reserved.
        </Box>
        
        {/* Version display in the footer */}
        <Box sx={{ width: '100%', textAlign: 'center', opacity: 0.7, fontSize: '0.8rem' }}>
          <VersionDisplay />
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
