# Cloud Load Balancing Simulator

> An interactive, browser-based visual simulator demonstrating traffic distribution algorithms, high availability, health monitoring, and horizontal autoscaling.

---

## 1. Project Overview

The **Cloud Load Balancing Simulator** is an educational, real-time visualization platform and browser-based demonstration tool modeling modern cloud reverse proxies and Layer-4/Layer-7 load balancers (such as AWS Elastic Load Balancing, Google Cloud Load Balancing, NGINX, and HAProxy). Built entirely with HTML5 Canvas, modern CSS animations, and vanilla ES6 JavaScript, it operates purely on the client side with zero backend dependencies.

The application allows systems architects, students, and engineers to observe how different routing strategies—Round Robin, Weighted Round Robin, Least Connections, Random, and Consistent IP Hashing—distribute incoming network requests across dynamically sized server pools. Real-time metrics, canvas graphs, active connection meters, and interactive node failure toggles illustrate cluster resilience and traffic failover in cloud architectures.

---

## 2. Problem Statement

Modern cloud applications experience volatile, unpredictable traffic volumes. Distributing network traffic efficiently across server instances is essential to prevent single points of failure (SPOF), avoid compute starvation, minimize latency, and maintain high service availability (HA).

However, cloud load balancing concepts—such as consistent hashing, weight prioritization, health checks, and connection saturation—can be abstract and difficult to observe directly inside production cloud environments without incurring cloud infrastructure costs. A real-time, interactive visual simulation provides immediate physical insight into how routing algorithms behave under varying loads, failure states, and capacity disparities.

---

## 3. Objectives

- Simulate cloud reverse-proxy and load-balancing mechanics in a zero-install, static web environment.
- Implement five canonical industry routing algorithms with interchangeable runtime strategy patterns.
- Visualize dynamic request flow animations from client ingress, through the load balancer, to target server instances.
- Enable interactive instance disruption (health toggling) to observe automatic traffic diversion and cluster self-healing.
- Render dynamic real-time telemetry (request distribution histograms, response latency line charts, and load donut charts) using native HTML5 Canvas.
- Provide a side-by-side comparative benchmarking mode calculating standard deviation and distribution evenness across algorithms.
- Maintain full automated test verification for all algorithm models using Jest.

---

## 4. Features

- **Five Dynamic Routing Algorithms:**
  - **Round Robin:** Deterministic, sequential server rotation.
  - **Least Connections:** Traffic dynamically steered to instances with lowest active load.
  - **Weighted Round Robin:** Proportional request allotment matching instance capacity weights.
  - **Random Distribution:** Unbiased stochastic allocation across healthy nodes.
  - **IP Hash:** Consistent deterministic hashing pinning client IPs to specific server instances.
- **Interactive Cluster Management:**
  - Dynamic scaling of backend server count (2 to 8 instances).
  - Variable traffic ingress throttling slider (1 to 20 requests per second).
  - Manual single-request injection mode for step-by-step routing inspection.
  - One-click health toggle simulating server downtime and failover recovery.
- **Real-Time Telemetry Dashboard:**
  - Live instance cards with connection progress meters, CPU usage, and memory gauges.
  - Pure HTML5 Canvas charts: Request distribution bar chart, latency over time, and load donut.
  - Live ingress queue displaying recent client IP addresses and routing destinations.
- **Comparative Algorithm Analysis:**
  - Batch benchmark runner evaluating all 5 algorithms against 100 identical requests.
  - Tabulates average latency, standard deviation, and distribution evenness percentages.

---

## 5. Cloud Computing Concepts Demonstrated

| Concept | Implementation in this Project |
| :--- | :--- |
| **Horizontal Scaling** | Dynamic addition and removal of worker nodes demonstrating distributed cluster capacity. |
| **High Availability (HA)** | Continuous routing around degraded or offline servers to eliminate single points of failure. |
| **Health Checking & Heartbeats** | Passive/active health probing preventing requests from routing to failing instances. |
| **Traffic Distribution Strategies** | Layer 4/7 scheduling algorithms optimizing throughput and avoiding node saturation. |
| **Session Affinity (Sticky Sessions)** | IP Hash algorithm ensuring continuous connection affinity to specific nodes. |

---

## 6. Technology Stack

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework**| Vanilla HTML5 & CSS3 | Modern Standard | Structure and neon cyber-themed layout |
| **Animation Engine** | CSS3 Keyframes & Transitions | Native | Physics-based request flow and node pulses |
| **Graphics** | HTML5 Canvas API | Native | Real-time charts without external dependencies |
| **Logic & Models** | ES6 JavaScript Modules | ECMAScript 2022 | Modular algorithm classes and state management |
| **Testing** | Jest | ^29.7.0 | Automated unit testing for algorithms and models |

---

## 7. Architecture & Workflow

```
+--------------------------------------------------------------------------+
|                        Client Traffic Generator                          |
|             (Slider Rate / Manual Single Request Generator)              |
+------------------------------------+-------------------------------------+
                                     | Request(id, clientIp, size)
                                     v
+--------------------------------------------------------------------------+
|                         Load Balancer Node (L4/L7)                       |
|   +------------------------------------------------------------------+   |
|   |                       Algorithm Selector                         |   |
|   |   [Round Robin | Least Conn | Weighted RR | Random | IP Hash]     |   |
|   +---------------------------------+--------------------------------+   |
|                                     | selectServer(servers, req)         |
+-------------------------------------+------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                            |                            |
         v                            v                            v
+------------------+         +------------------+         +------------------+
| Server Alpha     |         | Server Beta      |         | Server Gamma     |
| (Healthy, Cap:10)|         | (Healthy, Cap:15)|         | (Failed/Offline) |
+------------------+         +------------------+         +------------------+
         |                            |                            |
         +----------------------------+----------------------------+
                                      |
                           Telemetry & Metrics Sync
                                      v
+--------------------------------------------------------------------------+
|                     Canvas Charts & Telemetry HUD                        |
|        (Distribution Histograms | Latency Charts | Load Donut)          |
+--------------------------------------------------------------------------+
```

---

## 8. Folder Structure

```
project-4-load-balancing-simulator/
├── .gitignore                # Exclusions for node_modules and coverage
├── README.md                 # Complete project documentation
├── package.json              # Jest testing configuration
├── index.html                # Main single-page application entry point
├── css/
│   ├── styles.css            # Dark cyber-themed dashboard layout
│   └── animations.css        # Request flow animations and glow effects
├── js/
│   ├── app.js                # Main application orchestrator and event binding
│   ├── algorithms/
│   │   ├── roundRobin.js     # Round Robin implementation
│   │   ├── leastConnections.js # Least Connections implementation
│   │   ├── weightedRoundRobin.js # Weighted Round Robin implementation
│   │   ├── random.js         # Random distribution implementation
│   │   └── ipHash.js         # Consistent IP hashing implementation
│   ├── models/
│   │   ├── Server.js         # Server node data model and metrics
│   │   ├── Request.js        # Request packet abstraction
│   │   └── LoadBalancer.js   # Load balancer routing engine
│   ├── visualization/
│   │   ├── renderer.js       # Dynamic DOM server card updates
│   │   ├── charts.js         # Native HTML5 Canvas charts module
│   │   └── animator.js       # Dynamic particle flow animation pipeline
│   └── utils/
│       ├── helpers.js        # IP generators and utility math
│       └── statistics.js     # Standard deviation and distribution analytics
└── tests/
    ├── LoadBalancer.test.js  # Tests for orchestrator routing
    ├── Server.test.js        # Tests for instance lifecycle and load metrics
    ├── ipHash.test.js        # Tests for consistent hash stability
    ├── leastConnections.test.js # Tests for connection-weighted routing
    ├── random.test.js        # Tests for stochastic allocation
    ├── roundRobin.test.js    # Tests for sequential rotation
    ├── statistics.test.js    # Tests for standard deviation calculations
    └── weightedRoundRobin.test.js # Tests for weight ratio adherence
```

---

## 9. Prerequisites

- **Web Browser:** Any modern browser (Google Chrome, Mozilla Firefox, Safari, Edge) supporting ES6 and HTML5 Canvas.
- **Node.js (Optional, for running tests only):** version `18.x` or later.

---

## 10. Installation & Local Setup

1. **Clone or navigate to the repository:**
   ```bash
   cd cloud-computing-projects/project-4-load-balancing-simulator
   ```

2. **Run locally:**
   - Simply double click `index.html` to open it in your default web browser, OR
   - Serve using any static server:
     ```bash
     python -m http.server 8080
     ```
     Then open `http://localhost:8080`.

3. **Install dependencies (only if executing Jest tests):**
   ```bash
   npm install
   ```

---

## 11. How to Test

Execute the Jest test suite:

```bash
npm test
```

### Coverage Report:
```bash
npm run test:coverage
```

*Expected Verification Output:*
```
PASS tests/roundRobin.test.js
PASS tests/leastConnections.test.js
PASS tests/weightedRoundRobin.test.js
PASS tests/random.test.js
PASS tests/ipHash.test.js
PASS tests/Server.test.js
PASS tests/LoadBalancer.test.js
PASS tests/statistics.test.js

Test Suites: 8 passed, 8 total
Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        1.12 s
```

---

## 12. Algorithms Explained

### 1. Round Robin
Cycles through active servers in a circular sequence: Server 1 $\rightarrow$ Server 2 $\rightarrow$ Server 3 $\rightarrow$ Server 1. Ideal for homogeneous clusters where server capacities and request processing costs are uniform.

### 2. Least Connections
Directs each new request to the server with the lowest current active connection count. Crucial for long-lived transactions (e.g., WebSocket connections, long-running database queries) where request completion times vary widely.

### 3. Weighted Round Robin
Assigns requests in proportion to integer weights designated per server (e.g., 3:1 ratio routes 3 requests to instance A for every 1 to instance B). Ideal for heterogeneous server pools with different CPU/RAM specifications.

### 4. Random Distribution
Selects an available healthy instance using pseudo-random generation. Efficient in distributed peer-to-peer topologies without centralized state coordination.

### 5. IP Hash
Calculates a hash digest from the incoming client IP address modulo the active server pool size. Ensures that requests originating from the same client IP persistently route to the identical backend server (session affinity without central caches).

---

## 13. Cloud Deployment Instructions

### Deploy to GitHub Pages (Static Hosting)
1. Push this repository to GitHub as `cloud-load-balancing-simulator`.
2. Navigate to your repository **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment** $\rightarrow$ **Branch**, choose `main` and path `/ (root)`.
4. Click **Save**. The live simulator is hosted globally on GitHub's Fastly CDN at `https://<username>.github.io/cloud-load-balancing-simulator/`.

### Deploy to Netlify
1. Drag and drop the `project-4-load-balancing-simulator` folder directly onto the [Netlify Drop](https://app.netlify.com/drop) target.
2. Netlify instantly deploys the static site to its global Edge network.

### Deploy to Vercel (Static)
1. Run `vercel deploy` in the project root.
2. Select static deployment defaults.

---

## 14. Verified Live Website URL

- **GitHub Repository:** https://github.com/nagavishwa-spidey/project-4-load-balancing-simulator
- **Live Deployment URL:** https://nagavishwa-spidey.github.io/project-4-load-balancing-simulator/

---

## 15. Screenshots & Visual Captures

To document simulator operations:
1. Open the simulator and initiate traffic at 5 req/s.
2. Capture the animated particle trails traveling from the ingress node through the Load Balancer to active instances.
3. Click a server card to trigger failure (turning it red) and record remaining nodes absorbing the rerouted traffic.
4. Click **Compare Algorithms** and capture the summary benchmark table.
5. Save captures in `assets/screenshots/`:
   - `01-active-simulation.png`: Main dashboard with active animations and connection meters.
   - `02-failover-event.png`: Degraded server showing automatic traffic bypass.
   - `03-algorithm-comparison.png`: Side-by-side benchmark matrix.

---

## 16. Limitations & Future Improvements

- **Network Jitter Simulation:** Current request completion uses fixed simulated delays; adding random packet latency and timeout retries would increase realism.
- **Geographic Proximity Routing:** Extend algorithms with simulated GeoDNS / latency-based routing.
- **Auto-Scaling Group Simulation:** Automatically spawn new server instances when cluster CPU load exceeds 80%.

---

## 17. License

This project is open-source software licensed under the **MIT License**.

---

## 18. Author

Developed by **nagavishwa-spidey** for Cloud Computing Engineering.
