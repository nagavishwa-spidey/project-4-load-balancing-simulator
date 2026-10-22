/**
 * Helper Utility Functions
 * 
 * Common utility functions used throughout the application.
 */

const Helpers = {
  /**
   * Generate a random IP address.
   * @returns {string} Random IPv4 address
   */
  generateRandomIp() {
    return `${this.randomInt(1, 255)}.${this.randomInt(0, 255)}.${this.randomInt(0, 255)}.${this.randomInt(1, 255)}`;
  },

  /**
   * Generate a random integer between min and max (inclusive).
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random integer
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Generate a unique ID.
   * @returns {string} Unique identifier
   */
  generateId() {
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Format milliseconds into a human-readable string.
   * @param {number} ms - Milliseconds
   * @returns {string} Formatted time string
   */
  formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  },

  /**
   * Format a number with commas for thousands separator.
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * Throttle a function to only execute once per specified period.
   * @param {Function} func - Function to throttle
   * @param {number} limit - Minimum time between calls in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  },

  /**
   * Debounce a function to only execute after a specified delay.
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  /**
   * Get a color based on a percentage value (green → yellow → red).
   * @param {number} percent - Value from 0-100
   * @returns {string} CSS color string
   */
  getLoadColor(percent) {
    if (percent < 40) return '#00ff88';
    if (percent < 70) return '#ffaa00';
    return '#ff4444';
  },

  /**
   * Generate server names based on cloud naming conventions.
   * @param {number} index - Server index
   * @returns {string} Server name
   */
  generateServerName(index) {
    const regions = ['us-east', 'us-west', 'eu-west', 'ap-south', 'ap-east', 'eu-north', 'sa-east', 'af-south'];
    return `${regions[index % regions.length]}-${Math.floor(index / regions.length) + 1}`;
  }
};

if (typeof module !== 'undefined') module.exports = Helpers;
