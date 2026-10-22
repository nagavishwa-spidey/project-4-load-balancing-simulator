/**
 * Server Model
 * 
 * Represents a backend server in the load balancing pool.
 * Tracks connections, performance metrics, and health status.
 */
class Server {
  /**
   * @param {number} id - Unique server identifier
   * @param {string} name - Human-readable server name
   * @param {number} capacity - Maximum concurrent connections
   * @param {number} weight - Server weight for weighted algorithms (1-10)
   */
  constructor(id, name, capacity = 100, weight = 1) {
    this.id = id;
    this.name = name || `Server ${id}`;
    this.capacity = capacity;
    this.weight = Math.max(1, Math.min(10, weight));
    this.activeConnections = 0;
    this.totalRequests = 0;
    this.totalResponseTime = 0;
    this.healthy = true;
    this.cpuUsage = 0;
    this.memoryUsage = 0;
    this._activeRequests = new Map();
  }

  /**
   * Add a request to this server.
   * @param {Object} request - The Request object to process
   * @returns {boolean} True if the request was accepted
   */
  addRequest(request) {
    if (!this.healthy) return false;

    this.activeConnections++;
    this.totalRequests++;
    request.assignedServer = this.id;

    // Simulate processing time based on load and request size
    const baseTime = 50 + Math.random() * 150;
    const loadFactor = 1 + (this.activeConnections / this.capacity);
    const sizeFactor = request.size ? request.size / 50 : 1;
    request.processingTime = Math.round(baseTime * loadFactor * sizeFactor);

    this._activeRequests.set(request.id, request);

    // Update simulated resource usage
    this._updateMetrics();

    return true;
  }

  /**
   * Complete and remove a request from this server.
   * @param {string|number} requestId - The request ID to complete
   * @returns {Object|null} The completed request, or null if not found
   */
  completeRequest(requestId) {
    const request = this._activeRequests.get(requestId);
    if (!request) return null;

    this.activeConnections = Math.max(0, this.activeConnections - 1);
    this.totalResponseTime += request.processingTime || 0;
    request.completed = true;

    this._activeRequests.delete(requestId);

    // Update simulated resource usage
    this._updateMetrics();

    return request;
  }

  /**
   * Calculate the current load as a percentage.
   * @returns {number} Load percentage (0-100)
   */
  getLoad() {
    if (this.capacity === 0) return 100;
    return Math.min(100, (this.activeConnections / this.capacity) * 100);
  }

  /**
   * Calculate the average response time for completed requests.
   * @returns {number} Average response time in ms, or 0 if no requests
   */
  getAverageResponseTime() {
    const completedRequests = this.totalRequests - this.activeConnections;
    if (completedRequests <= 0) return 0;
    return Math.round(this.totalResponseTime / completedRequests);
  }

  /**
   * Toggle the health status of this server.
   * @returns {boolean} New health status
   */
  toggleHealth() {
    this.healthy = !this.healthy;
    if (!this.healthy) {
      // Drop all active connections when server goes unhealthy
      this._activeRequests.clear();
      this.activeConnections = 0;
      this.cpuUsage = 0;
      this.memoryUsage = 0;
    }
    return this.healthy;
  }

  /**
   * Update simulated CPU and memory usage based on current load.
   * @private
   */
  _updateMetrics() {
    const loadPercent = this.getLoad();
    // CPU correlates with load but with some variance
    this.cpuUsage = Math.min(100, Math.round(loadPercent * (0.8 + Math.random() * 0.4)));
    // Memory grows more slowly than CPU
    this.memoryUsage = Math.min(100, Math.round(loadPercent * (0.5 + Math.random() * 0.3) + 10));
  }

  /**
   * Reset the server to initial state.
   */
  reset() {
    this.activeConnections = 0;
    this.totalRequests = 0;
    this.totalResponseTime = 0;
    this.healthy = true;
    this.cpuUsage = 0;
    this.memoryUsage = 0;
    this._activeRequests.clear();
  }
}

if (typeof module !== 'undefined') module.exports = Server;
