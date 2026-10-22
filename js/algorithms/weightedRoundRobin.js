/**
 * Weighted Round Robin Load Balancing Algorithm
 * 
 * Distributes requests proportionally based on server weights.
 * Higher weight servers receive more requests.
 * Uses effective weight tracking for smooth distribution.
 */
class WeightedRoundRobin {
  constructor() {
    this.name = 'Weighted Round Robin';
    this.currentWeights = [];
    this.initialized = false;
  }

  /**
   * Initialize or re-initialize effective weights based on server weights.
   * @param {Array} servers - Array of Server instances
   */
  _initWeights(servers) {
    this.currentWeights = servers.map(s => 0);
    this.initialized = true;
  }

  /**
   * Select a server using weighted round robin.
   * Uses the smooth weighted round robin algorithm:
   * 1. For each server, add its weight to its current weight
   * 2. Select the server with the highest current weight
   * 3. Subtract the total weight from the selected server's current weight
   * 
   * @param {Array} servers - Array of Server instances
   * @param {Object} request - The incoming request
   * @returns {Object|null} The selected server, or null if none available
   */
  selectServer(servers, request) {
    if (!servers || servers.length === 0) return null;

    const healthyServers = servers.filter(s => s.healthy);
    if (healthyServers.length === 0) return null;

    // Re-initialize if server count changed
    if (!this.initialized || this.currentWeights.length !== servers.length) {
      this._initWeights(servers);
    }

    // Calculate total weight of healthy servers
    let totalWeight = 0;
    for (let i = 0; i < servers.length; i++) {
      if (servers[i].healthy) {
        totalWeight += (servers[i].weight || 1);
      }
    }

    // Add each healthy server's weight to its current weight
    for (let i = 0; i < servers.length; i++) {
      if (servers[i].healthy) {
        this.currentWeights[i] += (servers[i].weight || 1);
      }
    }

    // Find server with highest current weight among healthy servers
    let selectedIndex = -1;
    let maxWeight = -Infinity;
    for (let i = 0; i < servers.length; i++) {
      if (!servers[i].healthy) continue;
      if (this.currentWeights[i] > maxWeight) {
        maxWeight = this.currentWeights[i];
        selectedIndex = i;
      }
    }

    if (selectedIndex === -1) return null;

    // Subtract total weight from selected server's current weight
    this.currentWeights[selectedIndex] -= totalWeight;

    return servers[selectedIndex];
  }

  /**
   * Reset the algorithm state.
   */
  reset() {
    this.currentWeights = [];
    this.initialized = false;
  }
}

if (typeof module !== 'undefined') module.exports = WeightedRoundRobin;
