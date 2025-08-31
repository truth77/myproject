import React from 'react';

const BibleStudy = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Bible Study Resources</h1>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <p>Welcome to our Bible Study resources. Here you'll find a collection of studies, devotionals, and tools to help you grow in your understanding of God's Word.</p>
        <div style={{ marginTop: '2rem' }}>
          <h3>Featured Studies</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '1rem 0', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h4>Book of John</h4>
              <p>A verse-by-verse study of the Gospel of John</p>
            </li>
            <li style={{ margin: '1rem 0', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <h4>Romans: The Gospel of Grace</h4>
              <p>Understanding Paul's letter to the Romans</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BibleStudy;
