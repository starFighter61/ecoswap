import api from '../utils/api';

const API_URL = '/auth';

/**
 * Service for authentication-related API calls
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with the registration response
   */
  async register(userData) {
    try {
      const response = await api.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise with the login response
   */
  async login(email, password) {
    try {
      const response = await api.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get the current user's profile
   * @returns {Promise} - Promise with the user profile
   */
  async getCurrentUser() {
    try {
      const response = await api.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - The error object
   * @returns {Error} - Formatted error object
   */
  handleError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return {
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
        data: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        status: 503,
        message: 'Server unavailable. Please try again later.',
        data: null
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        status: 500,
        message: error.message || 'An unexpected error occurred',
        data: null
      };
    }
  }
}

export default new AuthService();