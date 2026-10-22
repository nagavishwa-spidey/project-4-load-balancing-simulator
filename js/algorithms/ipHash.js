/**
 * IP Hash Load Balancing Algorithm
 * 
 * Hashes the client IP address to determine which server handles the request.
 * Provides session persistence: same IP always routes to the same server
 * (as long as the server pool is unchanged and the target server is healthy).
 */
class IpHash {
  constructor() {
    this.name = 'IP Hash';
  }

  /**
   * Simple hash function for IP addresses.
   * Uses DJB2 hash algorithm variant.
   * @param {string} ip - The client IP address
   * @returns {number} Hash value (non-negative integer)
   */
  _hash(ip) {
    let hash = 5381;
    for (let i = 0; i < ip.length; i++) {
      hash = ((hash << 5) + hash) + ip.charCodeAt(i); // hash * 33 + c
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Select a server based on the client IP hash.
   * @param {Array} servers - Array of Server instances
   * @param {Object} request - The incoming request (must have clientIp property)
   * @returns {Object|null} The selected server, or null if none available
   */
  selectServer(servers, request) {
    if (!servers || servers.length === 0) return null;

    const healthyServers = servers.filter(s => s.healthy);
    if (healthyServers.length === 0) return null;

    const ip = (request && request.clientIp) ? request.clientIp : '0.0.0.0';
    const hash = this._hash(ip);
    const index = hash % healthyServers.length;

    return healthyServers[index];
  }

  /**
   * Reset the algorithm state.
   */
  reset() {
    // IP Hash is stateless
  }
}

if (typeof module !== 'undefined') module.exports = IpHash;
