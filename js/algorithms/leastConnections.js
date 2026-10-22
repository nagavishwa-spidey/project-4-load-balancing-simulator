/**
 * Least Connections Load Balancing Algorithm
 * 
 * Selects the server with the fewest active connections.
 * Tie-breaking: chooses the server with the lowest index.
 * Skips unhealthy servers automatically.
 */
class LeastConnections {
  constructor() {
    this.name = 'Least Connections';
  }

  /**
   * Select the server with the fewest active connections.
   * @param {Array} servers - Array of Server instances
   * @param {Object} request - The incoming request
   * @returns {Object|null} The selected server, or null if none available
   */
  selectServer(servers, request) {
    if (!servers || servers.length === 0) return null;

    const healthyServers = servers.filter(s => s.healthy);
    if (healthyServers.length === 0) return null;

    let selectedServer = null;
    let minConnections = Infinity;

    // Iterate through all servers to maintain index-based tie-breaking
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i];
      if (!server.healthy) continue;

      if (server.activeConnections < minConnections) {
        minConnections = server.activeConnections;
        selectedServer = server;
      }
    }

    return selectedServer;
  }

  /**
   * Reset the algorithm state.
   */
  reset() {
    // Least connections is stateless
  }
}

if (typeof module !== 'undefined') module.exports = LeastConnections;
