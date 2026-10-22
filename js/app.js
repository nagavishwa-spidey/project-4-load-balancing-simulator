/**
 * Main Application Controller for Cloud Load Balancing Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  // Algorithms registry
  const algorithms = {
    'round-robin': new RoundRobin(),
    'least-connections': new LeastConnections(),
    'weighted-round-robin': new WeightedRoundRobin(),
    'random': new Random(),
    'ip-hash': new IpHash()
  };

  // State
  let servers = [];
  let loadBalancer = null;
  let isRunning = false;
  let simulationTimer = null;
  let requestCounter = 0;
  let responseTimeHistory = [];

  // DOM Elements
  const algorithmSelect = document.getElementById('algorithm-select');
  const serverCountInput = document.getElementById('server-count');
  const serverCountVal = document.getElementById('server-count-val');
  const requestRateInput = document.getElementById('request-rate');
  const requestRateVal = document.getElementById('request-rate-val');

  const startBtn = document.getElementById('start-btn');
  const sendOneBtn = document.getElementById('send-one-btn');
  const resetBtn = document.getElementById('reset-btn');
  const compareBtn = document.getElementById('compare-btn');

  function initServers(count) {
    servers = [];
    const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'];
    for (let i = 0; i < count; i++) {
      const id = `s${i + 1}`;
      const name = `Server ${names[i] || (i + 1)}`;
      const capacity = 10 + (i % 3) * 5; // capacities 10, 15, 20
      const weight = 1 + (i % 4);        // weights 1..4
      servers.push(new Server(id, name, capacity, weight));
    }
  }

  function initLoadBalancer() {
    const selectedAlgoKey = algorithmSelect.value;
    const selectedAlgo = algorithms[selectedAlgoKey] || algorithms['round-robin'];
    loadBalancer = new LoadBalancer(servers, selectedAlgo);
    Renderer.renderServers(servers, toggleServerHealth);
    updateStatsAndCharts();
  }

  function toggleServerHealth(server) {
    server.toggleHealth();
    Renderer.updateServerCard(server);
    updateStatsAndCharts();
  }

  function sendSingleRequest() {
    requestCounter++;
    const clientIp = Helpers.generateRandomIp();
    const request = new Request(requestCounter, clientIp, 100);

    const assignedServer = loadBalancer.routeRequest(request);

    if (assignedServer) {
      const serverIndex = servers.findIndex(s => s.id === assignedServer.id);
      Animator.animateRequest(request, assignedServer, serverIndex);
      Renderer.renderRequest(request, assignedServer);

      // Simulate completion after server processing duration
      setTimeout(() => {
        assignedServer.completeRequest(request.id);
        Renderer.updateServerCard(assignedServer);
        updateStatsAndCharts();
      }, request.processingTime || 800);
    } else {
      Renderer.renderRequest(request, null);
    }

    Renderer.updateLoadBalancerNode(true, loadBalancer.algorithm.name);
    updateStatsAndCharts();
  }

  function startSimulation() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Pause Simulation';
    startBtn.classList.add('btn-warning');

    const rate = parseInt(requestRateInput.value, 10) || 5;
    const interval = Math.max(50, Math.floor(1000 / rate));

    simulationTimer = setInterval(() => {
      sendSingleRequest();
    }, interval);
  }

  function pauseSimulation() {
    isRunning = false;
    clearInterval(simulationTimer);
    simulationTimer = null;
    startBtn.textContent = 'Start Simulation';
    startBtn.classList.remove('btn-warning');
    Renderer.updateLoadBalancerNode(false, loadBalancer.algorithm.name);
  }

  function resetSimulation() {
    pauseSimulation();
    requestCounter = 0;
    responseTimeHistory = [];
    Animator.clearQueue();
    Object.values(algorithms).forEach(algo => {
      if (typeof algo.reset === 'function') algo.reset();
    });
    initServers(parseInt(serverCountInput.value, 10));
    initLoadBalancer();
    const queue = document.getElementById('request-queue');
    if (queue) queue.innerHTML = '';
    const comp = document.getElementById('comparison-results');
    if (comp) comp.style.display = 'none';
  }

  function updateStatsAndCharts() {
    const stats = loadBalancer.getStatistics();
    Renderer.renderStats(stats);

    responseTimeHistory.push({ time: Date.now(), value: stats.averageResponseTime });
    if (responseTimeHistory.length > 30) responseTimeHistory.shift();

    Charts.drawDistributionChart('chart-distribution', servers);
    Charts.drawLineChart('chart-response-time', responseTimeHistory);
    Charts.drawLoadChart('chart-load', servers);
  }

  function runAlgorithmComparison() {
    pauseSimulation();
    const testRequestCount = 100;
    const results = [];

    const algoKeys = Object.keys(algorithms);

    algoKeys.forEach(key => {
      const algo = algorithms[key];
      if (typeof algo.reset === 'function') algo.reset();

      // Fresh test servers
      const testServers = [];
      for (let i = 0; i < 4; i++) {
        testServers.push(new Server(`ts${i}`, `Server ${i + 1}`, 15, i + 1));
      }

      const testLb = new LoadBalancer(testServers, algo);

      for (let r = 1; r <= testRequestCount; r++) {
        const req = new Request(r, Helpers.generateRandomIp(), 100);
        testLb.routeRequest(req);
      }

      const stats = testLb.getStatistics();
      const stdDev = Statistics.calculateStdDeviation(testServers);

      results.push({
        algorithm: algo.name,
        avgResponseTime: stats.averageResponseTime,
        stdDeviation: Math.round(stdDev * 10) / 10
      });
    });

    Renderer.renderComparison(results);
  }

  // Event Listeners
  algorithmSelect.addEventListener('change', () => {
    const selectedKey = algorithmSelect.value;
    const algo = algorithms[selectedKey];
    if (algo) {
      loadBalancer.changeAlgorithm(algo);
      Renderer.updateLoadBalancerNode(isRunning, algo.name);
      updateStatsAndCharts();
    }
  });

  serverCountInput.addEventListener('input', (e) => {
    serverCountVal.textContent = e.target.value;
  });

  serverCountInput.addEventListener('change', (e) => {
    initServers(parseInt(e.target.value, 10));
    initLoadBalancer();
  });

  requestRateInput.addEventListener('input', (e) => {
    requestRateVal.textContent = `${e.target.value} req/s`;
    if (isRunning) {
      pauseSimulation();
      startSimulation();
    }
  });

  startBtn.addEventListener('click', () => {
    if (isRunning) pauseSimulation();
    else startSimulation();
  });

  sendOneBtn.addEventListener('click', sendSingleRequest);
  resetBtn.addEventListener('click', resetSimulation);
  compareBtn.addEventListener('click', runAlgorithmComparison);

  // Initialize
  initServers(4);
  initLoadBalancer();
});
