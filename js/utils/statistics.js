/**
 * Statistics Utility Module
 * 
 * Provides functions for calculating load balancing statistics,
 * distribution metrics, and generating comprehensive reports.
 */

const Statistics = {
  /**
   * Calculate the distribution of requests across servers as percentages.
   * @param {Array} servers - Array of Server instances
   * @returns {Array} Array of { serverId, name, requests, percentage }
   */
  calculateDistribution(servers) {
    if (!servers || servers.length === 0) return [];

    const totalRequests = servers.reduce((sum, s) => sum + s.totalRequests, 0);

    return servers.map(s => ({
      serverId: s.id,
      name: s.name,
      requests: s.totalRequests,
      percentage: totalRequests > 0
        ? Math.round((s.totalRequests / totalRequests) * 10000) / 100
        : 0
    }));
  },

  /**
   * Calculate the overall average response time across all servers.
   * @param {Array} servers - Array of Server instances
   * @returns {number} Average response time in ms
   */
  calculateAverageResponseTime(servers) {
    if (!servers || servers.length === 0) return 0;

    let totalTime = 0;
    let totalCompleted = 0;

    servers.forEach(s => {
      const completed = s.totalRequests - s.activeConnections;
      if (completed > 0) {
        totalTime += s.totalResponseTime;
        totalCompleted += completed;
      }
    });

    return totalCompleted > 0 ? Math.round(totalTime / totalCompleted) : 0;
  },

  /**
   * Calculate standard deviation of request distribution.
   * Measures how evenly requests are distributed across servers.
   * @param {Array} servers - Array of Server instances
   * @returns {number} Standard deviation of request counts
   */
  calculateStdDeviation(servers) {
    if (!servers || servers.length === 0) return 0;

    const requests = servers.map(s => s.totalRequests);
    const n = requests.length;
    const mean = requests.reduce((sum, r) => sum + r, 0) / n;
    const squaredDiffs = requests.map(r => Math.pow(r - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, d) => sum + d, 0) / n;

    return Math.round(Math.sqrt(avgSquaredDiff) * 100) / 100;
  },

  /**
   * Get utilization percentages for all servers.
   * @param {Array} servers - Array of Server instances
   * @returns {Array} Array of { serverId, name, utilization, healthy }
   */
  getServerUtilization(servers) {
    if (!servers || servers.length === 0) return [];

    return servers.map(s => ({
      serverId: s.id,
      name: s.name,
      utilization: s.getLoad(),
      healthy: s.healthy
    }));
  },

  /**
   * Generate a comprehensive statistics report for the load balancer.
   * @param {Object} loadBalancer - LoadBalancer instance
   * @returns {Object} Comprehensive report object
   */
  generateReport(loadBalancer) {
    if (!loadBalancer) return null;

    const servers = loadBalancer.servers;
    const distribution = this.calculateDistribution(servers);
    const avgResponseTime = this.calculateAverageResponseTime(servers);
    const stdDeviation = this.calculateStdDeviation(servers);
    const utilization = this.getServerUtilization(servers);

    const healthyServers = servers.filter(s => s.healthy);
    const totalRequests = servers.reduce((sum, s) => sum + s.totalRequests, 0);
    const totalActiveConnections = servers.reduce((sum, s) => sum + s.activeConnections, 0);

    return {
      algorithm: loadBalancer.algorithm ? loadBalancer.algorithm.name : 'None',
      totalRequests,
      totalActiveConnections,
      serverCount: servers.length,
      healthyServerCount: healthyServers.length,
      averageResponseTime: avgResponseTime,
      standardDeviation: stdDeviation,
      distribution,
      utilization,
      timestamp: Date.now()
    };
  }
};

if (typeof module !== 'undefined') module.exports = Statistics;
