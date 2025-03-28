import api from '../utils/api';

const API_URL = '/items';

/**
 * Service for item-related API calls
 */
class ItemService {
  /**
   * Create a new item
   * @param {Object} itemData - Item data
   * @returns {Promise} - Promise with the created item
   */
  async createItem(itemData) {
    try {
      const response = await api.post(API_URL, itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all items with filtering
   * @param {Object} filters - Filter parameters
   * @returns {Promise} - Promise with filtered items
   */
  async getItems(filters = {}) {
    try {
      const response = await api.get(API_URL, { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get nearby items
   * @param {number} longitude - Longitude coordinate
   * @param {number} latitude - Latitude coordinate
   * @param {number} radius - Search radius in kilometers (optional)
   * @returns {Promise} - Promise with nearby items
   */
  async getNearbyItems(longitude, latitude, radius = 10) {
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
   * Get item by ID
   * @param {string} itemId - Item ID
   * @returns {Promise} - Promise with the item
   */
  async getItemById(itemId) {
    try {
      const response = await api.get(`${API_URL}/${itemId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update item
   * @param {string} itemId - Item ID
   * @param {Object} itemData - Updated item data
   * @returns {Promise} - Promise with the updated item
   */
  async updateItem(itemId, itemData) {
    try {
      const response = await api.put(`${API_URL}/${itemId}`, itemData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete item
   * @param {string} itemId - Item ID
   * @returns {Promise} - Promise with the deletion result
   */
  async deleteItem(itemId) {
    try {
      const response = await api.delete(`${API_URL}/${itemId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Express interest in an item
   * @param {string} itemId - Item ID
   * @returns {Promise} - Promise with the result
   */
  async expressInterest(itemId) {
    try {
      const response = await api.post(`${API_URL}/${itemId}/interest`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search items by keyword
   * @param {string} keyword - Search keyword
   * @param {Object} filters - Additional filter parameters
   * @returns {Promise} - Promise with search results
   */
  async searchItems(keyword, filters = {}) {
    try {
      const response = await api.get(API_URL, { 
        params: { 
          search: keyword,
          ...filters
        } 
      });
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

export default new ItemService();