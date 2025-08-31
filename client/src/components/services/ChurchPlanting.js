import React from 'react';
import { Link } from 'react-router-dom';

const ChurchPlanting = () => {
  const churchPlants = [
    {
      id: 1,
      name: 'ARK Network Nairobi',
      location: 'Nairobi, Kenya',
      pastor: 'Pastor James Mwangi',
      founded: '2020',
      image: 'https://via.placeholder.com/400x250?text=ARK+Nairobi',
      description: 'Our flagship church plant in the heart of Nairobi, reaching the urban community with the Gospel.'
    },
    {
      id: 2,
      name: 'ARK Network Mombasa',
      location: 'Mombasa, Kenya',
      pastor: 'Pastor Amina Omondi',
      founded: '2021',
      image: 'https://via.placeholder.com/400x250?text=ARK+Mombasa',
      description: 'Coastal outreach bringing the love of Christ to the people of Mombasa.'
    },
    {
      id: 3,
      name: 'ARK Network Eldoret',
      location: 'Eldoret, Kenya',
      pastor: 'Pastor David Kiprop',
      founded: '2022',
      image: 'https://via.placeholder.com/400x250?text=ARK+Eldoret',
      description: 'Serving the Rift Valley region with transformative biblical teaching.'
    },
    {
      id: 4,
      name: 'ARK Network Kisumu',
      location: 'Kisumu, Kenya',
      pastor: 'Pastor Grace Atieno',
      founded: '2023',
      image: 'https://via.placeholder.com/400x250?text=ARK+Kisumu',
      description: 'Our newest church plant, bringing hope to the Lake Victoria region.'
    }
  ];

  const upcomingLaunches = [
    {
      id: 1,
      location: 'Nakuru, Kenya',
      targetDate: 'Q2 2024',
      status: 'In Planning',
      description: 'Planting a new church in Nakuru to reach the growing population in the Rift Valley.'
    },
    {
      id: 2,
      location: 'Kakamega, Kenya',
      targetDate: 'Q4 2024',
      status: 'Fundraising',
      description: 'Expanding our reach to Western Kenya with a new church plant in Kakamega.'
    }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '3rem 2rem',
          borderRadius: '8px',
          marginBottom: '3rem',
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(44, 62, 80, 0.8), rgba(44, 62, 80, 0.9)), url(/images/church-planting.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem',
            color: 'white',
            marginBottom: '1rem',
            fontWeight: '700'
          }}>
            Church Planting Initiative
          </h1>
          <p style={{
            fontSize: '1.2rem',
            maxWidth: '800px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Join us in our mission to plant biblically faithful, culturally relevant, and community-transforming churches across Kenya and beyond.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/get-involved" 
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: '#c0392b'
                }
              }}
            >
              Get Involved
            </Link>
            <Link 
              to="/support" 
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: '2px solid white',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Support the Mission
            </Link>
          </div>
        </div>

        {/* Our Church Plants */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            color: '#2c3e50',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2rem',
            position: 'relative',
            paddingBottom: '0.5rem'
          }}>
            Our Church Plants
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              backgroundColor: '#e74c3c',
              borderRadius: '2px'
            }}></span>
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {churchPlants.map(church => (
              <div key={church.id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <div style={{
                  height: '180px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={church.image} 
                    alt={church.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: '#2c3e50',
                    fontSize: '1.25rem'
                  }}>
                    {church.name}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                    color: '#7f8c8d',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>📍</span>
                    <span>{church.location}</span>
                  </div>
                  <div style={{
                    marginBottom: '1rem',
                    color: '#555',
                    lineHeight: '1.5',
                    fontSize: '0.95rem'
                  }}>
                    {church.description}
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ marginBottom: '0.25rem' }}>
                      <strong>Pastor:</strong> {church.pastor}
                    </div>
                    <div>
                      <strong>Established:</strong> {church.founded}
                    </div>
                  </div>
                  <Link 
                    to={`/churches/${church.id}`}
                    style={{
                      display: 'inline-block',
                      color: '#2c3e50',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#e74c3c'
                      }
                    }}
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Launches */}
        <section style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '4rem'
        }}>
          <h2 style={{
            color: '#2c3e50',
            textAlign: 'center',
            marginTop: 0,
            marginBottom: '2rem',
            fontSize: '1.8rem'
          }}>
            Upcoming Church Plants
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {upcomingLaunches.map(launch => (
              <div key={launch.id} style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: '#2c3e50',
                    fontSize: '1.2rem'
                  }}>
                    {launch.location}
                  </h3>
                  <span style={{
                    backgroundColor: launch.status === 'In Planning' ? '#f39c12' : '#3498db',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {launch.status}
                  </span>
                </div>
                <p style={{
                  color: '#555',
                  marginBottom: '1.5rem',
                  lineHeight: '1.5'
                }}>
                  {launch.description}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto',
                  paddingTop: '1rem',
                  borderTop: '1px solid #eee'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#7f8c8d',
                      marginBottom: '0.25rem'
                    }}>
                      Target Launch
                    </div>
                    <div style={{
                      fontWeight: '600',
                      color: '#2c3e50'
                    }}>
                      {launch.targetDate}
                    </div>
                  </div>
                  <button style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #2c3e50',
                    color: '#2c3e50',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#2c3e50',
                      color: 'white'
                    }
                  }}>
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Get Involved */}
        <section style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          borderRadius: '8px',
          padding: '3rem 2rem',
          textAlign: 'center',
          marginBottom: '4rem',
          backgroundImage: 'linear-gradient(rgba(44, 62, 80, 0.8), rgba(44, 62, 80, 0.9)), url(/images/support-church-planting.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <h2 style={{
            fontSize: '2rem',
            marginTop: 0,
            marginBottom: '1rem'
          }}>
            Join Our Church Planting Team
          </h2>
          <p style={{
            maxWidth: '700px',
            margin: '0 auto 2rem',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            Whether you're called to go, send, or pray, there's a place for you in our church planting mission.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/volunteer" 
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'background-color 0.2s',
                '&:hover': {
                  backgroundColor: '#c0392b'
                }
              }}
            >
              Volunteer
            </Link>
            <Link 
              to="/donate" 
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: '2px solid white',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Donate
            </Link>
            <Link 
              to="/pray" 
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                border: '2px solid white',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Pray With Us
            </Link>
          </div>
        </section>

        {/* Church Planting Process */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{
            color: '#2c3e50',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '2rem'
          }}>
            Our Church Planting Process
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            {[
              {
                step: '1',
                title: 'Prayer & Discernment',
                description: 'We begin with prayer and careful discernment to identify strategic locations for new church plants.'
              },
              {
                step: '2',
                title: 'Assessment & Training',
                description: 'Potential church planters undergo thorough assessment and training to ensure they\'re equipped for the mission.'
              },
              {
                step: '3',
                title: 'Team Building',
                description: 'We assemble a core team of committed believers who will help launch the new church.'
              },
              {
                step: '4',
                title: 'Launch Preparation',
                description: 'Extensive preparation including community outreach, marketing, and securing a meeting place.'
              },
              {
                step: '5',
                title: 'Public Launch',
                description: 'The new church is launched with a public worship service and ongoing outreach efforts.'
              },
              {
                step: '6',
                title: 'Multiplication',
                description: 'As the church grows, it begins to plant other churches, continuing the cycle of multiplication.'
              }
            ].map((step, index) => (
              <div key={index} style={{
                flex: '1 1 250px',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                textAlign: 'center',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                },
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: '0 auto 1rem',
                  position: 'relative',
                  zIndex: 1
                }}>
                  {step.step}
                </div>
                <h3 style={{
                  color: '#2c3e50',
                  marginTop: 0,
                  marginBottom: '1rem',
                  fontSize: '1.25rem'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: '#7f8c8d',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChurchPlanting;
