/**
 * DOM Rendering Engine
 * 
 * Responsible for rendering and updating all UI elements including
 * server cards, request queue, load balancer node, and statistics.
 */

const Renderer = {
  /**
   * Render all server cards in the server grid.
   * @param {Array} servers - Array of Server instances
   * @param {Function} onServerClick - Callback when a server is clicked
   */
  renderServers(servers, onServerClick) {
    const container = document.getElementById('server-grid');
    if (!container) return;

    container.innerHTML = '';

    servers.forEach((server, index) => {
      const card = this._createServerCard(server, index, onServerClick);
      container.appendChild(card);
    });
  },

  /**
   * Create a server card DOM element.
   * @param {Object} server - Server instance
   * @param {number} index - Server index
   * @param {Function} onClick - Click handler
   * @returns {HTMLElement} Server card element
   * @private
   */
  _createServerCard(server, index, onClick) {
    const card = document.createElement('div');
    card.className = `server-card ${!server.healthy ? 'unhealthy' : ''} ${server.getLoad() > 80 ? 'overloaded' : ''}`;
    card.id = `server-${server.id}`;
    card.dataset.serverId = server.id;

    const loadPercent = server.getLoad();
    const loadColor = this._getLoadColor(loadPercent);

    card.innerHTML = `
      <div class="server-header">
        <span class="server-name">${server.name}</span>
        <span class="health-dot ${server.healthy ? 'healthy' : 'unhealthy'}"></span>
      </div>
      <div class="server-metrics">
        <div class="metric">
          <label>Connections</label>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${loadPercent}%; background: ${loadColor};"></div>
          </div>
          <span class="metric-value">${server.activeConnections}/${server.capacity}</span>
        </div>
        <div class="metric">
          <label>CPU</label>
          <div class="progress-bar">
            <div class="progress-fill cpu" style="width: ${server.cpuUsage}%; background: ${this._getLoadColor(server.cpuUsage)};"></div>
          </div>
          <span class="metric-value">${Math.round(server.cpuUsage)}%</span>
        </div>
        <div class="metric">
          <label>Memory</label>
          <div class="progress-bar">
            <div class="progress-fill memory" style="width: ${server.memoryUsage}%; background: ${this._getLoadColor(server.memoryUsage)};"></div>
          </div>
          <span class="metric-value">${Math.round(server.memoryUsage)}%</span>
        </div>
      </div>
      <div class="server-stats">
        <div class="stat">
          <span class="stat-label">Total Requests</span>
          <span class="stat-value">${server.totalRequests}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Avg Response</span>
          <span class="stat-value">${server.getAverageResponseTime()}ms</span>
        </div>
        <div class="stat">
          <span class="stat-label">Weight</span>
          <span class="stat-value">${server.weight}</span>
        </div>
      </div>
    `;

    card.style.borderColor = loadColor;
    card.style.boxShadow = `0 0 10px ${loadColor}33`;

    if (onClick) {
      card.addEventListener('click', () => onClick(server));
      card.style.cursor = 'pointer';
    }

    return card;
  },

  /**
   * Update a single server card without re-rendering everything.
   * @param {Object} server - Server instance
   */
  updateServerCard(server) {
    const card = document.getElementById(`server-${server.id}`);
    if (!card) return;

    const loadPercent = server.getLoad();
    const loadColor = this._getLoadColor(loadPercent);

    // Update health dot
    const healthDot = card.querySelector('.health-dot');
    if (healthDot) {
      healthDot.className = `health-dot ${server.healthy ? 'healthy' : 'unhealthy'}`;
    }

    // Update card class
    card.className = `server-card ${!server.healthy ? 'unhealthy' : ''} ${server.getLoad() > 80 ? 'overloaded' : ''}`;

    // Update progress bars
    const fills = card.querySelectorAll('.progress-fill');
    if (fills[0]) {
      fills[0].style.width = `${loadPercent}%`;
      fills[0].style.background = loadColor;
    }
    if (fills[1]) {
      fills[1].style.width = `${server.cpuUsage}%`;
      fills[1].style.background = this._getLoadColor(server.cpuUsage);
    }
    if (fills[2]) {
      fills[2].style.width = `${server.memoryUsage}%`;
      fills[2].style.background = this._getLoadColor(server.memoryUsage);
    }

    // Update metric values
    const metricValues = card.querySelectorAll('.metric-value');
    if (metricValues[0]) metricValues[0].textContent = `${server.activeConnections}/${server.capacity}`;
    if (metricValues[1]) metricValues[1].textContent = `${Math.round(server.cpuUsage)}%`;
    if (metricValues[2]) metricValues[2].textContent = `${Math.round(server.memoryUsage)}%`;

    // Update stat values
    const statValues = card.querySelectorAll('.stat-value');
    if (statValues[0]) statValues[0].textContent = server.totalRequests;
    if (statValues[1]) statValues[1].textContent = `${server.getAverageResponseTime()}ms`;
    if (statValues[2]) statValues[2].textContent = server.weight;

    // Update border glow
    card.style.borderColor = loadColor;
    card.style.boxShadow = `0 0 10px ${loadColor}33`;
  },

  /**
   * Render the statistics dashboard.
   * @param {Object} stats - Statistics object from LoadBalancer.getStatistics()
   */
  renderStats(stats) {
    const container = document.getElementById('stats-panel');
    if (!container) return;

    document.getElementById('stat-total-requests').textContent = stats.totalRequests;
    document.getElementById('stat-algorithm').textContent = stats.activeAlgorithm;
    document.getElementById('stat-server-count').textContent = `${stats.healthyServerCount}/${stats.serverCount}`;
    document.getElementById('stat-avg-response').textContent = `${stats.averageResponseTime}ms`;
  },

  /**
   * Render incoming request in the request queue.
   * @param {Object} request - Request object
   * @param {Object} server - Assigned server
   */
  renderRequest(request, server) {
    const queue = document.getElementById('request-queue');
    if (!queue) return;

    const reqEl = document.createElement('div');
    reqEl.className = 'request-item';
    reqEl.id = `request-${request.id}`;
    reqEl.innerHTML = `
      <span class="req-id">#${request.id}</span>
      <span class="req-ip">${request.clientIp}</span>
      <span class="req-server">→ ${server ? server.name : 'N/A'}</span>
    `;

    queue.insertBefore(reqEl, queue.firstChild);

    // Keep only last 20 requests visible
    while (queue.children.length > 20) {
      queue.removeChild(queue.lastChild);
    }
  },

  /**
   * Render comparison results for multiple algorithms.
   * @param {Array} results - Array of comparison result objects
   */
  renderComparison(results) {
    const container = document.getElementById('comparison-results');
    if (!container) return;

    container.innerHTML = '<h3>Algorithm Comparison Results</h3>';

    const table = document.createElement('table');
    table.className = 'comparison-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Algorithm</th>
          <th>Avg Response Time</th>
          <th>Std Deviation</th>
          <th>Distribution Evenness</th>
        </tr>
      </thead>
      <tbody>
        ${results.map(r => `
          <tr>
            <td>${r.algorithm}</td>
            <td>${r.avgResponseTime}ms</td>
            <td>${r.stdDeviation}</td>
            <td>
              <div class="evenness-bar">
                <div class="evenness-fill" style="width: ${Math.max(0, 100 - r.stdDeviation)}%"></div>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    `;

    container.appendChild(table);
    container.style.display = 'block';
  },

  /**
   * Get color based on load percentage.
   * @param {number} percent - Load percentage (0-100)
   * @returns {string} CSS color string
   * @private
   */
  _getLoadColor(percent) {
    if (percent < 40) return '#00ff88';
    if (percent < 70) return '#ffaa00';
    return '#ff4444';
  },

  /**
   * Update the load balancer node visual state.
   * @param {boolean} active - Whether the LB is actively routing
   * @param {string} algorithmName - Current algorithm name
   */
  updateLoadBalancerNode(active, algorithmName) {
    const node = document.getElementById('lb-node');
    if (!node) return;

    node.className = `lb-node ${active ? 'active' : ''}`;
    const label = node.querySelector('.lb-algorithm');
    if (label) label.textContent = algorithmName;
  }
};

if (typeof module !== 'undefined') module.exports = Renderer;
