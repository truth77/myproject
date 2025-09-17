// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
console.log('API Base URL:', API_BASE_URL);

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      // Clear any existing auth data
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
    
    // Handle other errors
    const error = (data && data.message) || response.statusText;
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: data
    });
    throw new Error(error);
  }
  
  return data;
};

// Helper function to handle network errors
const handleNetworkError = (error) => {
  console.error('Network error:', error);
  throw new Error('Unable to connect to the server. Please check your internet connection.');
};

// Add authorization header to requests
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Posts API
export const postsApi = {
  // Get all posts
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Get single post by ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Create new post
  create: async (postData) => {
    try {
      const formData = new FormData();
      Object.entries(postData).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        body: formData,
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Update post
  update: async (id, postData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(postData),
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Delete post
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },
};

// Auth API
export const authApi = {
  // Login
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await handleResponse(response);
      
      // Store token if received
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      // Remove the /api from the URL since it's already included in the base URL
      const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
      const registerUrl = `${baseUrl}/api/register`;
      
      console.log('Sending registration request to:', registerUrl);
      console.log('Request payload:', { 
        ...userData, 
        password: userData.password ? '***' : undefined 
      });
      
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(userData),
        credentials: 'include',
        mode: 'cors'
      });
      
      console.log('Registration response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type') || '';
      let responseData;
      
      try {
        responseData = await response.text();
        if (contentType.includes('application/json')) {
          responseData = JSON.parse(responseData);
        }
      } catch (parseError) {
        console.warn('Error parsing response:', parseError);
        throw new Error(`Failed to parse response: ${parseError.message}`);
      }
      
      console.log('Registration response data:', responseData);
      
      if (!response.ok) {
        const error = new Error(
          (responseData && responseData.error) || 
          (typeof responseData === 'string' && responseData) || 
          `Registration failed with status ${response.status}`
        );
        error.response = response;
        error.status = response.status;
        error.data = responseData;
        throw error;
      }
      
      // If we got a token in the response, store it
      if (responseData && responseData.token) {
        localStorage.setItem('token', responseData.token);
      }
      
      return responseData;
    } catch (error) {
      console.error('Error in register function:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    // Don't make the request if we don't have a token
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found in localStorage');
      return null;
    }

    try {
      const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      console.log('Current user response status:', response.status);
      
      // If we get a 401, clear the invalid token
      if (response.status === 401) {
        console.log('Token expired or invalid, removing from storage');
        localStorage.removeItem('token');
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Current user data:', data);
      return data;
      
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Don't remove token here as it might be a network error
      return null;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },
};

// Donations API
export const donationsApi = {
  // Create a donation session
  createCheckoutSession: async (donationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(donationData),
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Get donation history
  getDonationHistory: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/donations/history`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },
};

// Subscriptions API
export const subscriptionsApi = {
  // Get available subscription plans
  getPlans: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/plans`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Create a checkout session for subscription
  createCheckoutSession: async (priceId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId })
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Create a customer portal session for managing subscriptions
  createCustomerPortalSession: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/customer-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Get current user's subscription status
  getSubscriptionStatus: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Admin: Get all subscribers
  getSubscribers: async ({ page = 1, limit = 10, search = '' } = {}) => {
    try {
      const token = localStorage.getItem('token');
      const query = new URLSearchParams({
        page,
        limit,
        search
      }).toString();
      
      const response = await fetch(`${API_BASE_URL}/admin/subscribers?${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Admin: Get subscriber details
  getSubscriber: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/subscribers/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Admin: Update subscription
  updateSubscription: async (userId, subscriptionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/subscribers/${userId}/subscription`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscriptionData)
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Admin: Cancel subscription for a user
  adminCancelSubscription: async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/subscribers/${userId}/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Admin: Get dashboard stats
  getAdminStats: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },

  // Admin: Export subscribers
  exportSubscribers: async (format = 'csv') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/subscribers/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to export subscribers');
      }
      
      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      return { success: true };
    } catch (error) {
      handleNetworkError(error);
    }
  },
};

// Premium Content API
export const premiumApi = {
  // Get premium content (requires active subscription)
  getPremiumContent: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/premium/content`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return handleResponse(response);
    } catch (error) {
      handleNetworkError(error);
    }
  },
};

// Global error handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
