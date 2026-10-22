/**
 * Load Balancer Orchestrator
 * 
 * Central coordinator that routes incoming requests to backend servers
 * using the configured algorithm. Tracks request history and provides statistics.
 */

// Browser-compatible imports
if (typeof require !== 'undefined') {
  // Node.js / Jest environment - imports handled by test files
}

class LoadBalancer {
  /**
   * @param {Array} servers - Array of Server instances
   * @param {Object} algorithm - Algorithm instance with selectServer method
   */
  constructor(servers = [], algorithm = null) {
    this.servers = servers;
    this.algorithm = algorithm;
    this.requestLog = [];
    this.totalRequests = 0;
  }

  /**
   * Route an incoming request to a server using the current algorithm.
   * @param {Object} request - The Request object to route
   * @returns {Object|null} The selected server, or null if routing failed
   */
  routeRequest(request) {
    if (!this.algorithm) return null;

    const server = this.algorithm.selectServer(this.servers, request);
    if (!server) return null;

    server.addRequest(request);
    this.requestLog.push({
      requestId: request.id,
      serverId: server.id,
      serverName: server.name,
      timestamp: request.timestamp,
      clientIp: request.clientIp,
      size: request.size
    });
    this.totalRequests++;

    return server;
  }

  /**
   * Get comprehensive statistics about the load balancer's operation.
   * @returns {Object} Statistics object
   */
  getStatistics() {
    const totalReqs = this.servers.reduce((sum, s) => sum + s.totalRequests, 0);
    const healthyCount = this.servers.filter(s => s.healthy).length;

    const distribution = {};
    this.servers.forEach(s => {
      distribution[s.name] = s.totalRequests;
    });

    const avgResponseTime = this._calculateAverageResponseTime();
    const serverLoads = this.servers.map(s => ({
      id: s.id,
      name: s.name,
      load: s.getLoad(),
      connections: s.activeConnections,
      totalRequests: s.totalRequests,
      avgResponseTime: s.getAverageResponseTime(),
      healthy: s.healthy
    }));

    return {
      totalRequests: totalReqs,
      activeAlgorithm: this.algorithm ? this.algorithm.name : 'None',
      serverCount: this.servers.length,
      healthyServerCount: healthyCount,
      distribution,
      averageResponseTime: avgResponseTime,
      serverLoads,
      requestLog: this.requestLog.slice(-100) // Last 100 entries
    };
  }

  /**
   * Change the load balancing algorithm.
   * @param {Object} newAlgorithm - New algorithm instance
   */
  changeAlgorithm(newAlgorithm) {
    this.algorithm = newAlgorithm;
  }

  /**
   * Add a new server to the pool.
   * @param {Object} server - Server instance to add
   */
  addServer(server) {
    this.servers.push(server);
    // Reset algorithm state if it has state (like round robin)
    if (this.algorithm && typeof this.algorithm.reset === 'function') {
      this.algorithm.reset();
    }
  }

  /**
   * Remove a server from the pool by ID.
   * @param {number} id - Server ID to remove
   * @returns {Object|null} The removed server, or null if not found
   */
  removeServer(id) {
    const index = this.servers.findIndex(s => s.id === id);
    if (index === -1) return null;

    const removed = this.servers.splice(index, 1)[0];
    // Reset algorithm state
    if (this.algorithm && typeof this.algorithm.reset === 'function') {
      this.algorithm.reset();
    }
    return removed;
  }

  /**
   * Reset the load balancer and all servers to initial state.
   */
  reset() {
    this.requestLog = [];
    this.totalRequests = 0;
    this.servers.forEach(s => s.reset());
    if (this.algorithm && typeof this.algorithm.reset === 'function') {
      this.algorithm.reset();
    }
  }

  /**
   * Calculate overall average response time across all servers.
   * @returns {number} Average response time in ms
   * @private
   */
  _calculateAverageResponseTime() {
    let totalTime = 0;
    let totalCompleted = 0;

    this.servers.forEach(s => {
      const completed = s.totalRequests - s.activeConnections;
      if (completed > 0) {
        totalTime += s.totalResponseTime;
        totalCompleted += completed;
      }
    });

    return totalCompleted > 0 ? Math.round(totalTime / totalCompleted) : 0;
  }
}

if (typeof module !== 'undefined') module.exports = LoadBalancer;
