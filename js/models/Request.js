/**
 * Request Model
 * 
 * Represents an incoming HTTP request to be routed by the load balancer.
 */
class Request {
  /**
   * @param {number|string} id - Unique request identifier
   * @param {string} clientIp - Simulated client IP address
   * @param {number} size - Request size (affects processing time)
   */
  constructor(id, clientIp = '127.0.0.1', size = 50) {
    this.id = id;
    this.clientIp = clientIp;
    this.size = size;
    this.timestamp = Date.now();
    this.assignedServer = null;
    this.processingTime = 0;
    this.completed = false;
  }

  /**
   * Mark this request as completed.
   */
  complete() {
    this.completed = true;
  }

  /**
   * Get the duration since the request was created.
   * @returns {number} Duration in milliseconds
   */
  getDuration() {
    return Date.now() - this.timestamp;
  }
}

if (typeof module !== 'undefined') module.exports = Request;
