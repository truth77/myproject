import React, { useState, useEffect } from 'react';

const LiveServices = () => {
  const [isLive, setIsLive] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: 'Sunday Morning Service',
      date: '2023-12-10',
      time: '10:00 AM',
      description: 'Join us for worship and the Word with Pastor John Smith.',
      image: 'https://via.placeholder.com/600x400?text=Sunday+Service'
    },
    {
      id: 2,
      title: 'Bible Study',
      date: '2023-12-13',
      time: '7:00 PM',
      description: 'Midweek Bible study on the Book of Romans.',
      image: 'https://via.placeholder.com/600x400?text=Bible+Study'
    },
    {
      id: 3,
      title: 'Prayer Meeting',
      date: '2023-12-15',
      time: '6:30 PM',
      description: 'Corporate prayer and intercession for our community and nation.',
      image: 'https://via.placeholder.com/600x400?text=Prayer+Meeting'
    }
  ]);

  // Simulate checking if we're live
  useEffect(() => {
    const checkLiveStatus = () => {
      // In a real app, this would be an API call
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday
      const hours = now.getHours();
      
      // Simulate live on Sundays between 9:30 AM and 12:30 PM
      const isSunday = day === 0;
      const isServiceTime = hours >= 9 && hours < 12;
      
      setIsLive(isSunday && isServiceTime);
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Live Services</h1>
      
      {isLive ? (
        <div style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: 'white',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
          <span style={{ fontWeight: '600' }}>LIVE NOW</span>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#7f8c8d',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: 0.7
          }}></div>
          <span>OFFLINE - Next service: Sunday at 10:00 AM</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: isLive ? '1fr 1fr' : '1fr',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {isLive && (
          <div style={{
            backgroundColor: '#2c3e50',
            borderRadius: '8px',
            overflow: 'hidden',
            color: 'white'
          }}>
            <div style={{
              backgroundColor: '#1a252f',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Live Stream</h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#e74c3c',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                LIVE
              </div>
            </div>
            <div style={{
              aspectRatio: '16/9',
              backgroundColor: '#1a252f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.7)',
                padding: '2rem'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>▶️</div>
                <h3 style={{ color: 'white', margin: '0 0 0.5rem 0' }}>Sunday Morning Service</h3>
                <p style={{ margin: '0 0 1.5rem 0' }}>Live from ARK Network</p>
                <button style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  ':hover': {
                    backgroundColor: '#c0392b'
                  }
                }}>
                  Watch Now
                </button>
              </div>
            </div>
            <div style={{
              padding: '1rem',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Now Playing</div>
                <div style={{ fontWeight: '500' }}>Worship & The Word</div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.875rem'
              }}>
                <span>🔴</span>
                <span>1,245 watching</span>
              </div>
            </div>
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          height: 'fit-content'
        }}>
          <div style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '1rem',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Upcoming Events
          </div>
          <div style={{
            maxHeight: isLive ? '500px' : 'none',
            overflowY: 'auto'
          }}>
            {upcomingEvents.map(event => (
              <div key={event.id} style={{
                padding: '1.25rem',
                borderBottom: '1px solid #eee',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: '80px',
                    height: '60px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img 
                      src={event.image} 
                      alt={event.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div>
                    <h3 style={{
                      margin: '0 0 0.25rem 0',
                      color: '#2c3e50',
                      fontSize: '1rem'
                    }}>
                      {event.title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      color: '#7f8c8d',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <p style={{
                      margin: '0',
                      color: '#555',
                      fontSize: '0.875rem',
                      lineHeight: '1.4'
                    }}>
                      {event.description}
                    </p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '0.75rem'
                }}>
                  <button style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #2c3e50',
                    color: '#2c3e50',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#2c3e50',
                      color: 'white'
                    }
                  }}>
                    Set Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #eee',
            textAlign: 'center'
          }}>
            <button style={{
              backgroundColor: '#2c3e50',
              color: 'white',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#1a252f'
              }
            }}>
              View All Events
            </button>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          color: '#2c3e50',
          marginTop: 0,
          marginBottom: '1.5rem',
          fontSize: '1.5rem'
        }}>
          Watch Recent Services
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            {
              id: 1,
              title: 'The Power of Prayer',
              date: 'December 3, 2023',
              duration: '45:22',
              image: 'https://via.placeholder.com/400x225?text=The+Power+of+Prayer',
              views: '1.2K'
            },
            {
              id: 2,
              title: 'Walking in Faith',
              date: 'November 26, 2023',
              duration: '52:18',
              image: 'https://via.placeholder.com/400x225?text=Walking+in+Faith',
              views: '987'
            },
            {
              id: 3,
              title: 'The Heart of Worship',
              date: 'November 19, 2023',
              duration: '48:05',
              image: 'https://via.placeholder.com/400x225?text=The+Heart+of+Worship',
              views: '1.5K'
            }
          ].map(video => (
            <div key={video.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
              }
            }}>
              <div style={{
                position: 'relative',
                paddingTop: '56.25%', /* 16:9 Aspect Ratio */
                backgroundColor: '#f8f9fa',
                overflow: 'hidden'
              }}>
                <img 
                  src={video.image} 
                  alt={video.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {video.duration}
                </div>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(1.1)'
                  }
                }}>
                  <div style={{
                    width: 0,
                    height: 0,
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    borderLeft: '20px solid #2c3e50',
                    marginLeft: '4px'
                  }}></div>
                </div>
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  color: '#2c3e50',
                  fontSize: '1rem',
                  lineHeight: '1.4'
                }}>
                  {video.title}
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#7f8c8d',
                  fontSize: '0.8rem'
                }}>
                  <span>{video.date}</span>
                  <span>👁️ {video.views} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button style={{
            backgroundColor: 'transparent',
            border: '1px solid #2c3e50',
            color: '#2c3e50',
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: '#2c3e50',
              color: 'white'
            }
          }}>
            View All Sermons
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LiveServices;
