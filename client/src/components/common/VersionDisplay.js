import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

const VersionContainer = styled('div')({
  position: 'fixed',
  bottom: 8,
  left: 8,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  padding: '2px 8px',
  borderRadius: 4,
  fontSize: '0.8rem',
  fontFamily: 'monospace',
  zIndex: 9999,
  opacity: 0.7,
  '&:hover': {
    opacity: 1,
  },
});

const VersionDisplay = () => {
  const [version, setVersion] = useState('1.0.0');

  useEffect(() => {
    // This will be updated during the build process
    const versionFile = '/version.txt';
    
    // Add a timestamp to prevent caching
    const timestamp = new Date().getTime();
    fetch(`${versionFile}?v=${timestamp}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Version file not found');
        }
        return response.text();
      })
      .then(versionText => {
        setVersion(versionText.trim());
      })
      .catch(error => {
        console.error('Error loading version:', error);
        // Fallback to package.json version
        const packageVersion = process.env.REACT_APP_VERSION || '1.0.0';
        setVersion(packageVersion);
      });
  }, []);

  return <VersionContainer>v{version}</VersionContainer>;
};

export default VersionDisplay;
