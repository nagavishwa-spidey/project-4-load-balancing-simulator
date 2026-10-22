/**
 * Canvas-based Charts Module
 * 
 * Renders real-time statistics charts using the HTML5 Canvas API.
 * No external charting libraries required.
 */

const Charts = {
  /** Color palette for servers */
  colors: ['#00ff88', '#00aaff', '#ff6644', '#ffaa00', '#aa44ff', '#ff44aa', '#44ffaa', '#ff8800'],

  /**
   * Draw a bar chart showing request distribution per server.
   * @param {string} canvasId - Canvas element ID
   * @param {Array} servers - Array of Server instances
   */
  drawDistributionChart(canvasId, servers) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (!servers || servers.length === 0) return;

    const maxRequests = Math.max(1, ...servers.map(s => s.totalRequests));
    const barWidth = Math.floor((width - 60) / servers.length) - 10;
    const chartHeight = height - 50;

    // Title
    ctx.fillStyle = '#aabbcc';
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Request Distribution', width / 2, 15);

    // Draw bars
    servers.forEach((server, i) => {
      const barHeight = (server.totalRequests / maxRequests) * (chartHeight - 20);
      const x = 40 + i * (barWidth + 10);
      const y = chartHeight - barHeight + 20;

      // Bar
      const color = this.colors[i % this.colors.length];
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.shadowBlur = 0;

      // Value label
      ctx.fillStyle = '#ffffff';
      ctx.font = '11px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(server.totalRequests.toString(), x + barWidth / 2, y - 5);

      // Server name
      ctx.fillStyle = '#8899aa';
      ctx.font = '9px "Courier New", monospace';
      ctx.fillText(server.name.substring(0, 8), x + barWidth / 2, height - 5);
    });
  },

  /**
   * Draw a line chart showing response times over time.
   * @param {string} canvasId - Canvas element ID
   * @param {Array} dataPoints - Array of { timestamp, value } objects
   */
  drawResponseTimeChart(canvasId, dataPoints) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#aabbcc';
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Response Time (ms)', width / 2, 15);

    if (!dataPoints || dataPoints.length < 2) {
      ctx.fillStyle = '#556677';
      ctx.fillText('Collecting data...', width / 2, height / 2);
      return;
    }

    const padding = { top: 30, right: 20, bottom: 25, left: 45 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(1, ...dataPoints.map(d => d.value));
    const minValue = 0;

    // Draw grid lines
    ctx.strokeStyle = '#1a2a3a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const value = Math.round(maxValue - (maxValue / 4) * i);
      ctx.fillStyle = '#556677';
      ctx.font = '9px "Courier New", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(value.toString(), padding.left - 5, y + 3);
    }

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00aaff';
    ctx.shadowBlur = 5;

    dataPoints.forEach((point, i) => {
      const x = padding.left + (i / (dataPoints.length - 1)) * chartWidth;
      const y = padding.top + (1 - (point.value - minValue) / (maxValue - minValue)) * chartHeight;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
    ctx.shadowBlur = 0;
  },

  /**
   * Draw a donut chart showing server load distribution.
   * @param {string} canvasId - Canvas element ID
   * @param {Array} servers - Array of Server instances
   */
  drawLoadChart(canvasId, servers) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#aabbcc';
    ctx.font = '12px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Server Load', width / 2, 15);

    if (!servers || servers.length === 0) return;

    const centerX = width / 2;
    const centerY = height / 2 + 10;
    const outerRadius = Math.min(width, height) / 2 - 30;
    const innerRadius = outerRadius * 0.6;

    const totalLoad = servers.reduce((sum, s) => sum + Math.max(1, s.getLoad()), 0);
    let startAngle = -Math.PI / 2;

    servers.forEach((server, i) => {
      const load = Math.max(1, server.getLoad());
      const sliceAngle = (load / totalLoad) * Math.PI * 2;
      const color = this.colors[i % this.colors.length];

      // Draw slice
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = server.healthy ? color : '#333344';
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const avgLoad = Math.round(servers.reduce((sum, s) => sum + s.getLoad(), 0) / servers.length);
    ctx.fillText(`${avgLoad}%`, centerX, centerY);
  }
};

if (typeof module !== 'undefined') module.exports = Charts;
