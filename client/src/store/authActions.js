import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from './types';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: AUTH_ERROR });
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      }
    };

    const res = await axios.get('/api/auth', config);

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    console.error('Error loading user:', err);
    dispatch({ 
      type: AUTH_ERROR,
      payload: err.response?.data?.msg || 'Error loading user'
    });
  }
};

// Register User
const register = (userData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/users', userData, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response?.data?.msg || 'Registration failed'
    });
  }
};

// Login User
const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/auth', { email, password }, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.msg || 'Login failed'
    });
  }
};

// Logout
const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Clear Errors
const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};

export {
  register,
  login,
  logout,
  clearErrors
};
