const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testRegistration() {
  try {
    console.log('Testing registration...');
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      username: 'testuser123',
      email: 'test123@example.com',
      password: 'Test@1234'
    });
    
    console.log('Registration successful!');
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token);
    
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testLogin() {
  try {
    console.log('\nTesting login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test123@example.com',
      password: 'Test@1234'
    });
    
    console.log('Login successful!');
    console.log('User:', response.data.user);
    console.log('Token:', response.data.token);
    
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testAuthFlow() {
  try {
    // Test registration
    await testRegistration();
    
    // Test login
    await testLogin();
    
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed');
    process.exit(1);
  }
}

testAuthFlow();
