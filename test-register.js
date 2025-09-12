const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      username: 'testuser123',
      email: 'test123@example.com',
      password: 'Test@1234'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Registration failed:');
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received');
      console.error('Request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    console.error('Config:', error.config);
  }
}

testRegistration();
