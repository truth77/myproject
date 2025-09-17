import {
  GET_ADMIN_STATS_REQUEST,
  GET_ADMIN_STATS_SUCCESS,
  GET_ADMIN_STATS_FAIL,
  CLEAR_ADMIN_ERROR,
} from './types';

const initialState = {
  stats: {
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    recentActivity: [],
    lastUpdated: null
  },
  loading: false,
  error: null,
  lastFetched: null,
};

export default function adminReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ADMIN_STATS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
      
    case GET_ADMIN_STATS_SUCCESS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...payload,
          lastUpdated: new Date().toISOString(),
        },
        loading: false,
        lastFetched: new Date().toISOString(),
      };
      
    case GET_ADMIN_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: payload || 'Failed to load admin statistics',
      };
      
    case CLEAR_ADMIN_ERROR:
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
}

export const selectAdminStats = (state) => state.admin.stats;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectLastFetched = (state) => state.admin.lastFetched;
