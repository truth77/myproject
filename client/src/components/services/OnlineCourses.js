import React, { useState } from 'react';

const courses = [
  {
    id: 1,
    title: 'Foundations of Faith',
    instructor: 'Dr. Sarah Johnson',
    description: 'A comprehensive introduction to Christian beliefs and practices.',
    duration: '6 weeks',
    level: 'Beginner',
    image: 'https://via.placeholder.com/300x200?text=Foundations+of+Faith'
  },
  {
    id: 2,
    title: 'Biblical Hermeneutics',
    instructor: 'Prof. Michael Chen',
    description: 'Learn how to study and interpret the Bible effectively.',
    duration: '8 weeks',
    level: 'Intermediate',
    image: 'https://via.placeholder.com/300x200?text=Biblical+Hermeneutics'
  },
  {
    id: 3,
    title: 'Systematic Theology',
    instructor: 'Dr. Robert Williams',
    description: 'An in-depth study of Christian doctrines and theology.',
    duration: '12 weeks',
    level: 'Advanced',
    image: 'https://via.placeholder.com/300x200?text=Systematic+Theology',
    featured: true
  },
  {
    id: 4,
    title: 'Christian Apologetics',
    instructor: 'Dr. Elizabeth Kim',
    description: 'Defend your faith with intellectual integrity and clarity.',
    duration: '8 weeks',
    level: 'Intermediate',
    image: 'https://via.placeholder.com/300x200?text=Christian+Apologetics'
  },
  {
    id: 5,
    title: 'Church History',
    instructor: 'Prof. David Miller',
    description: 'Explore the rich history of Christianity from the early church to modern times.',
    duration: '10 weeks',
    level: 'Intermediate',
    image: 'https://via.placeholder.com/300x200?text=Church+History'
  },
  {
    id: 6,
    title: 'Spiritual Disciplines',
    instructor: 'Dr. Rebecca Adams',
    description: 'Develop spiritual practices to grow in your relationship with God.',
    duration: '6 weeks',
    level: 'Beginner',
    image: 'https://via.placeholder.com/300x200?text=Spiritual+Disciplines'
  }
];

const OnlineCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.level.toLowerCase() === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Online Courses</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              minWidth: '200px',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '1.5rem'
        }}>
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <p style={{ color: '#7f8c8d', fontSize: '1.1rem' }}>
            No courses match your search criteria. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

const CourseCard = ({ course }) => {
  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return '#2ecc71';
      case 'intermediate':
        return '#3498db';
      case 'advanced':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
      },
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      border: course.featured ? '2px solid #f1c40f' : 'none'
    }}>
      {course.featured && (
        <div style={{
          backgroundColor: '#f1c40f',
          color: '#2c3e50',
          padding: '0.25rem 0.75rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Featured
        </div>
      )}
      <img 
        src={course.image} 
        alt={course.title}
        style={{
          width: '100%',
          height: '160px',
          objectFit: 'cover',
          borderBottom: '1px solid #eee'
        }}
      />
      <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <span style={{
            backgroundColor: getLevelColor(course.level),
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            display: 'inline-block',
            marginBottom: '0.75rem'
          }}>
            {course.level}
          </span>
          <h3 style={{ 
            margin: '0.5rem 0',
            color: '#2c3e50',
            fontSize: '1.25rem',
            lineHeight: '1.3'
          }}>
            {course.title}
          </h3>
          <p style={{
            color: '#7f8c8d',
            fontSize: '0.9rem',
            margin: '0.5rem 0 1rem 0',
            flexGrow: 1
          }}>
            {course.description}
          </p>
        </div>
        <div style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
            <div>Instructor: <strong>{course.instructor}</strong></div>
            <div>Duration: {course.duration}</div>
          </div>
          <button style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#1a252f'
            }
          }}>
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineCourses;
