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
