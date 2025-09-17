import axios from 'axios';
import { 
  GET_ADMIN_STATS_REQUEST, 
  GET_ADMIN_STATS_SUCCESS, 
  GET_ADMIN_STATS_FAIL,
  CLEAR_ADMIN_ERROR
} from './types';

// Base URL for API requests
const API_URL = process.env.REACT_APP_API_URL || 'http://backend:3000/api';

// Helper function to get auth config
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    timeout: 10000, // 10 seconds timeout
  };
};

// Clear admin errors
export const clearAdminError = () => (dispatch) => {
  dispatch({ type: CLEAR_ADMIN_ERROR });
};

// Get admin dashboard statistics
export const getAdminStats = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ADMIN_STATS_REQUEST });
    
    const config = getAuthConfig();
    const { data } = await axios.get(
      `${API_URL}/admin/dashboard`, 
      config
    );

    // Ensure we have the expected data structure
    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to load admin statistics');
    }

    dispatch({
      type: GET_ADMIN_STATS_SUCCESS,
      payload: {
        totalUsers: data.data?.totalUsers || 0,
        activeSubscriptions: data.data?.activeSubscriptions || 0,
        monthlyRevenue: data.data?.monthlyRevenue || 0,
        recentActivity: data.data?.recentActivity || [],
        lastUpdated: new Date().toISOString()
      },
    });
    
    return { success: true, data: data.data };
  } catch (err) {
    console.error('Error in getAdminStats:', err);
    
    let errorMessage = 'Failed to load admin statistics';
    
    // Handle different types of errors
    if (err.response) {
      // Server responded with an error status code (4xx, 5xx)
      errorMessage = err.response.data?.error || errorMessage;
      
      // Handle specific status codes
      if (err.response.status === 401) {
        // Unauthorized - token might be invalid or expired
        errorMessage = 'Session expired. Please log in again.';
        // Optionally clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (err.response.status === 403) {
        // Forbidden - user doesn't have admin privileges
        errorMessage = 'You do not have permission to access this resource.';
      }
    } else if (err.request) {
      // Request was made but no response was received
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else if (err.message === 'Network Error') {
      errorMessage = 'Network error. Please check your internet connection.';
    } else if (err.message === 'No authentication token found') {
      errorMessage = 'Authentication required. Please log in.';
      window.location.href = '/login';
    } else {
      // Something else happened in setting up the request
      errorMessage = err.message || errorMessage;
    }
    
    dispatch({
      type: GET_ADMIN_STATS_FAIL,
      payload: errorMessage,
    });
    
    return { 
      success: false, 
      error: errorMessage,
      status: err.response?.status
    };
  }
};

// Example of another admin action with proper error handling
export const fetchAdminData = (endpoint) => async (dispatch) => {
  try {
    const config = getAuthConfig();
    const { data } = await axios.get(
      `${API_URL}/admin/${endpoint}`, 
      config
    );
    
    if (!data || !data.success) {
      throw new Error(data?.error || `Failed to fetch data from ${endpoint}`);
    }
    
    return { success: true, data: data.data };
  } catch (err) {
    console.error(`Error in fetchAdminData (${endpoint}):`, err);
    
    let errorMessage = `Failed to fetch data from ${endpoint}`;
    
    if (err.response) {
      errorMessage = err.response.data?.error || errorMessage;
    } else if (err.request) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else {
      errorMessage = err.message || errorMessage;
    }
    
    return { 
      success: false, 
      error: errorMessage,
      status: err.response?.status
    };
  }
};

// Example of a mutation action (POST/PUT/DELETE)
export const updateAdminData = (endpoint, payload) => async (dispatch) => {
  try {
    const config = getAuthConfig();
    const { data } = await axios.post(
      `${API_URL}/admin/${endpoint}`, 
      payload,
      config
    );
    
    if (!data || !data.success) {
      throw new Error(data?.error || `Failed to update data at ${endpoint}`);
    }
    
    // Optionally refresh the admin stats after a successful update
    await dispatch(getAdminStats());
    
    return { success: true, data: data.data };
  } catch (err) {
    console.error(`Error in updateAdminData (${endpoint}):`, err);
    
    let errorMessage = `Failed to update data at ${endpoint}`;
    
    if (err.response) {
      errorMessage = err.response.data?.error || errorMessage;
    } else if (err.request) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else {
      errorMessage = err.message || errorMessage;
    }
    
    return { 
      success: false, 
      error: errorMessage,
      status: err.response?.status
    };
  }
};

// Test admin route
export const testAdminRoute = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await axios.get(`${API_URL}/admin/test`, config);
    return res.data;
  } catch (err) {
    console.error('Error testing admin route:', err);
    throw err;
  }
};
