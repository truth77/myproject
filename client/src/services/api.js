// Use the full API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to handle responses
const handleResponse = async (response) => {
  // For 204 No Content responses, return null
  if (response.status === 204) {
    return null;
  }

  // For 401 Unauthorized, return null instead of throwing an error
  if (response.status === 401) {
    // Clear any invalid token
    localStorage.removeItem('token');
    return null;
  }

  // For 404 Not Found, return null instead of throwing an error
  if (response.status === 404) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    error.data = data;
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
    try {
      // Ensure we're using the correct base URL without double /api
      const baseUrl = API_BASE_URL.endsWith('/api') ? API_BASE_URL.slice(0, -4) : API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      const data = await handleResponse(response);
      
      // If we got a token in the response, store it
      if (data && data.token) {
        localStorage.setItem('token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
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
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      // If we get a 401, clear the invalid token
      if (response.status === 401) {
        localStorage.removeItem('token');
        return null;
      }
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/login/logout`, {
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

// Subscriptions API
export const subscriptionsApi = {
  // Get available subscription plans
  getPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/subscriptions/plans`);
    return handleResponse(response);
  },

  // Create a checkout session for subscription
  createCheckoutSession: async (priceId) => {
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
  },

  // Create a customer portal session for managing subscriptions
  createCustomerPortalSession: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/subscriptions/customer-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Get current user's subscription status
  getSubscriptionStatus: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/subscriptions/status`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Cancel subscription
  cancelSubscription: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/subscriptions/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Admin: Get all subscribers
  getSubscribers: async ({ page = 1, limit = 10, search = '' } = {}) => {
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
  },

  // Admin: Get subscriber details
  getSubscriber: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/subscribers/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Admin: Update subscription
  updateSubscription: async (userId, subscriptionData) => {
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
  },

  // Admin: Cancel subscription for a user
  adminCancelSubscription: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/subscribers/${userId}/subscription/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Admin: Get dashboard stats
  getAdminStats: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Admin: Export subscribers
  exportSubscribers: async (format = 'csv') => {
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
  },
};

// Premium Content API
export const premiumApi = {
  // Get premium content (requires active subscription)
  getPremiumContent: async () => {
    const response = await fetch(`${API_BASE_URL}/premium/content`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return handleResponse(response);
  },
};
