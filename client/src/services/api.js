const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }
  return data;
};

// Posts API
export const postsApi = {
  // Get all posts
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return handleResponse(response);
  },

  // Get single post by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    return handleResponse(response);
  },

  // Create new post
  create: async (postData) => {
    const formData = new FormData();
    Object.entries(postData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  // Update post
  update: async (id, postData) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    return handleResponse(response);
  },

  // Delete post
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Auth API
export const authApi = {
  // Login
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Register
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

// Donations API
export const donationsApi = {
  // Create a donation session
  createCheckoutSession: async (donationData) => {
    const response = await fetch(`${API_BASE_URL}/donations/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(donationData),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  // Get donation history
  getDonationHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/donations/history`, {
      credentials: 'include',
    });
    return handleResponse(response);
  },
};
