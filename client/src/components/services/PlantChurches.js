import React from 'react';

const PlantChurches = () => {
  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        color: '#27ae60',
        textAlign: 'center',
        marginBottom: '2rem',
        fontSize: '2.5rem',
        fontWeight: '600'
      }}>
        Plant Churches Initiative
      </h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <section>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '500',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '0.5rem'
          }}>
            About Our Mission
          </h2>
          <p style={{
            lineHeight: '1.8',
            color: '#4a5568',
            fontSize: '1.1rem',
            marginBottom: '1rem'
          }}>
            Our Plant Churches initiative is dedicated to establishing new communities of faith around the world. 
            We believe in spreading the Gospel by creating welcoming spaces where people can grow in their 
            relationship with God and each other.
          </p>
        </section>

        <section>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '500',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '0.5rem'
          }}>
            Get Involved
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            {[
              {
                title: 'Prayer Support',
                description: 'Join our prayer team to intercede for new church plants and missionaries.'
              },
              {
                title: 'Financial Partnership',
                description: 'Support church planting efforts through generous giving and funding.'
              },
              {
                title: 'Mission Trips',
                description: 'Short-term mission opportunities to assist with new church plants.'
              },
              {
                title: 'Church Planting Training',
                description: 'Receive training to start and lead new church communities.'
              }
            ].map((item, index) => (
              <div key={index} style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <h3 style={{
                  color: '#27ae60',
                  marginBottom: '0.75rem',
                  fontSize: '1.2rem'
                }}>{item.title}</h3>
                <p style={{
                  color: '#4a5568',
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 style={{
            color: '#2c3e50',
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '500',
            borderBottom: '2px solid #f0f0f0',
            paddingBottom: '0.5rem'
          }}>
            Upcoming Church Plants
          </h2>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '8px'
          }}>
            <p style={{
              fontStyle: 'italic',
              color: '#4a5568',
              textAlign: 'center',
              margin: '1rem 0'
            }}>
              Check back soon for updates on our upcoming church plants and how you can be involved!
            </p>
          </div>
        </section>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        padding: '2rem',
        backgroundColor: '#f0f8f0',
        borderRadius: '8px',
        borderLeft: '4px solid #27ae60'
      }}>
        <h3 style={{
          color: '#2c3e50',
          marginBottom: '1rem',
          fontSize: '1.3rem'
        }}>Ready to join our church planting mission?</h3>
        <p style={{
          color: '#4a5568',
          marginBottom: '1.5rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          Contact us to learn more about how you can be part of this exciting journey to spread the Gospel and plant new churches.
        </p>
        <button style={{
          backgroundColor: '#27ae60',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '6px',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          ':hover': {
            backgroundColor: '#219653'
          }
        }}>
          Contact Our Team
        </button>
      </div>
    </div>
  );
};

export default PlantChurches;
