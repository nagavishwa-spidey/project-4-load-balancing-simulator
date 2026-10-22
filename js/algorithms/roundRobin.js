/**
 * Round Robin Load Balancing Algorithm
 * 
 * Cycles through servers sequentially, distributing requests evenly.
 * Skips unhealthy servers automatically.
 */
class RoundRobin {
  constructor() {
    this.currentIndex = 0;
    this.name = 'Round Robin';
  }

  /**
   * Select the next server in round-robin order.
   * @param {Array} servers - Array of Server instances
   * @param {Object} request - The incoming request
   * @returns {Object|null} The selected server, or null if none available
   */
  selectServer(servers, request) {
    if (!servers || servers.length === 0) return null;

    const healthyServers = servers.filter(s => s.healthy);
    if (healthyServers.length === 0) return null;

    // Wrap currentIndex around the total server count
    if (this.currentIndex >= servers.length) {
      this.currentIndex = 0;
    }

    // Find the next healthy server starting from currentIndex
    let attempts = 0;
    while (attempts < servers.length) {
      const server = servers[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % servers.length;
      if (server.healthy) {
        return server;
      }
      attempts++;
    }

    return null;
  }

  /**
   * Reset the algorithm state.
   */
  reset() {
    this.currentIndex = 0;
  }
}

if (typeof module !== 'undefined') module.exports = RoundRobin;
