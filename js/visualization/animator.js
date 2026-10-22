/**
 * Request Flow Animator
 * 
 * Handles visual animations for requests flowing from clients
 * through the load balancer to the assigned server.
 * Uses CSS transitions and requestAnimationFrame.
 */

const Animator = {
  /** Queue of pending animations */
  animationQueue: [],
  /** Whether an animation is currently running */
  isAnimating: false,
  /** Server color palette matching charts */
  serverColors: ['#00ff88', '#00aaff', '#ff6644', '#ffaa00', '#aa44ff', '#ff44aa', '#44ffaa', '#ff8800'],

  /**
   * Animate a request flowing from source → load balancer → server.
   * @param {Object} request - Request object
   * @param {Object} server - Target server
   * @param {number} serverIndex - Index of the server for coloring
   */
  animateRequest(request, server, serverIndex) {
    this.animationQueue.push({ request, server, serverIndex });
    if (!this.isAnimating) {
      this._processQueue();
    }
  },

  /**
   * Process the animation queue.
   * @private
   */
  _processQueue() {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }

    this.isAnimating = true;
    const { request, server, serverIndex } = this.animationQueue.shift();
    this._createFlowAnimation(request, server, serverIndex);
  },

  /**
   * Create the actual DOM animation for a request flow.
   * @param {Object} request - Request object
   * @param {Object} server - Target server
   * @param {number} serverIndex - Server index
   * @private
   */
  _createFlowAnimation(request, server, serverIndex) {
    const visualArea = document.getElementById('visualization-area');
    if (!visualArea) {
      this._processQueue();
      return;
    }

    const color = this.serverColors[serverIndex % this.serverColors.length];

    // Create animated request dot
    const dot = document.createElement('div');
    dot.className = 'request-dot';
    dot.style.backgroundColor = color;
    dot.style.boxShadow = `0 0 10px ${color}`;
    dot.textContent = request.id;

    visualArea.appendChild(dot);

    // Phase 1: Client to Load Balancer
    requestAnimationFrame(() => {
      dot.classList.add('to-lb');

      setTimeout(() => {
        // Phase 2: Load Balancer to Server
        dot.classList.remove('to-lb');
        dot.classList.add('to-server');

        const serverCard = document.getElementById(`server-${server.id}`);
        if (serverCard) {
          serverCard.classList.add('receiving');
          setTimeout(() => serverCard.classList.remove('receiving'), 300);
        }

        setTimeout(() => {
          // Remove the dot
          dot.classList.add('fade-out');
          setTimeout(() => {
            if (dot.parentNode) dot.parentNode.removeChild(dot);
            // Process next in queue
            this._processQueue();
          }, 200);
        }, 400);
      }, 400);
    });

    // Pulse the load balancer node
    const lbNode = document.getElementById('lb-node');
    if (lbNode) {
      lbNode.classList.add('pulse');
      setTimeout(() => lbNode.classList.remove('pulse'), 500);
    }
  },

  /**
   * Clear all pending animations.
   */
  clearQueue() {
    this.animationQueue = [];
    this.isAnimating = false;

    // Remove any lingering animation elements
    const dots = document.querySelectorAll('.request-dot');
    dots.forEach(dot => {
      if (dot.parentNode) dot.parentNode.removeChild(dot);
    });
  }
};

if (typeof module !== 'undefined') module.exports = Animator;
