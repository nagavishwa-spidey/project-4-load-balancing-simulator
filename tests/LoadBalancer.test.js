const LoadBalancer = require('../js/models/LoadBalancer');
const Server = require('../js/models/Server');
const Request = require('../js/models/Request');
const RoundRobin = require('../js/algorithms/roundRobin');

describe('Load Balancer Model', () => {
  let lb;
  let servers;

  beforeEach(() => {
    servers = [
      new Server('s1', 'Server 1', 10, 1),
      new Server('s2', 'Server 2', 10, 1)
    ];
    lb = new LoadBalancer(servers, new RoundRobin());
  });

  test('routes requests and records statistics', () => {
    const req1 = new Request(1, '192.168.0.1');
    const assigned = lb.routeRequest(req1);
    expect(assigned).toBeDefined();
    expect(lb.totalRequests).toBe(1);

    const stats = lb.getStatistics();
    expect(stats.totalRequests).toBe(1);
    expect(stats.serverCount).toBe(2);
  });

  test('switches routing algorithm', () => {
    const dummyAlgo = { name: 'Dummy', selectServer: () => servers[0] };
    lb.changeAlgorithm(dummyAlgo);
    expect(lb.algorithm.name).toBe('Dummy');
  });
});
