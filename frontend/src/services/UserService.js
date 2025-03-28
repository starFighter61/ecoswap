import api from '../utils/api';

const API_URL = '/users';

/**
 * Service for user-related API calls
 */
class UserService {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the user profile
   */
  async getUserProfile(userId) {
    try {
      const response = await api.get(`${API_URL}/${userId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise with the updated user profile
   */
  async updateUserProfile(userId, userData) {
    try {
      const response = await api.put(`${API_URL}/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user items
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the user's items
   */
  async getUserItems(userId) {
    try {
      const response = await api.get(`${API_URL}/${userId}/items`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user swaps
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the user's swaps
   */
  async getUserSwaps(userId) {
    try {
      const response = await api.get(`${API_URL}/${userId}/swaps`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user reviews
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the user's reviews
   */
  async getUserReviews(userId) {
    try {
      const response = await api.get(`${API_URL}/${userId}/reviews`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get nearby users
   * @param {number} longitude - Longitude coordinate
   * @param {number} latitude - Latitude coordinate
   * @param {number} radius - Search radius in kilometers (optional)
   * @returns {Promise} - Promise with nearby users
   */
  async getNearbyUsers(longitude, latitude, radius = 10) {
    try {
      const response = await api.get(`${API_URL}/nearby`, {
        params: { longitude, latitude, radius }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user environmental impact
   * @param {string} userId - User ID
   * @returns {Promise} - Promise with the user's environmental impact
   */
  async getUserImpact(userId) {
    try {
      const response = await api.get(`${API_URL}/${userId}/impact`);
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

export default new UserService();