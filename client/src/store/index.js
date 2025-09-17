import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import adminReducer from './adminReducer';
import authReducer from './authReducer';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  // Add other reducers here
});

// Initial state
const initialState = {
  auth: {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null
  }
};

// Middleware
const middleware = [thunk];

// Add Redux DevTools extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create store
const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
