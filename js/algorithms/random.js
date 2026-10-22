/**
 * Random Load Balancing Algorithm
 * 
 * Randomly selects a server from the pool of healthy servers.
 * Accepts an optional seed for deterministic testing.
 */
class RandomAlgorithm {
  /**
   * @param {number|null} seed - Optional seed for reproducible results (testing)
   */
  constructor(seed = null) {
    this.name = 'Random';
    this.seed = seed;
    this._seedValue = seed;
  }

  /**
   * Simple seeded pseudo-random number generator (mulberry32).
   * @returns {number} A pseudo-random number between 0 and 1
   */
  _seededRandom() {
    if (this._seedValue === null) {
      return Math.random();
    }
    // Mulberry32 PRNG
    let t = this._seedValue += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Select a random healthy server.
   * @param {Array} servers - Array of Server instances
   * @param {Object} request - The incoming request
   * @returns {Object|null} The selected server, or null if none available
   */
  selectServer(servers, request) {
    if (!servers || servers.length === 0) return null;

    const healthyServers = servers.filter(s => s.healthy);
    if (healthyServers.length === 0) return null;

    const index = Math.floor(this._seededRandom() * healthyServers.length);
    return healthyServers[index];
  }

  /**
   * Reset the algorithm state.
   */
  reset() {
    this._seedValue = this.seed;
  }
}

if (typeof module !== 'undefined') module.exports = RandomAlgorithm;
