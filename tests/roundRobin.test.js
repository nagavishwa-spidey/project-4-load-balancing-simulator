const RoundRobin = require('../js/algorithms/roundRobin');
const Server = require('../js/models/Server');
const Request = require('../js/models/Request');

describe('Round Robin Algorithm', () => {
  let algo;
  let servers;

  beforeEach(() => {
    algo = new RoundRobin();
    servers = [
      new Server('s1', 'Server 1', 10, 1),
      new Server('s2', 'Server 2', 10, 1),
      new Server('s3', 'Server 3', 10, 1)
    ];
  });

  test('cycles through servers sequentially', () => {
    const req = new Request(1, '192.168.1.1');
    const s1 = algo.selectServer(servers, req);
    const s2 = algo.selectServer(servers, req);
    const s3 = algo.selectServer(servers, req);
    const s4 = algo.selectServer(servers, req);

    expect(s1.id).toBe('s1');
    expect(s2.id).toBe('s2');
    expect(s3.id).toBe('s3');
    expect(s4.id).toBe('s1'); // wrap around
  });

  test('skips unhealthy servers', () => {
    servers[1].healthy = false;
    const req = new Request(1, '192.168.1.1');
    const s1 = algo.selectServer(servers, req);
    const s2 = algo.selectServer(servers, req);

    expect(s1.id).toBe('s1');
    expect(s2.id).toBe('s3');
  });

  test('handles empty server list', () => {
    const req = new Request(1, '192.168.1.1');
    expect(algo.selectServer([], req)).toBeNull();
  });
});
