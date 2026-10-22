const LeastConnections = require('../js/algorithms/leastConnections');
const Server = require('../js/models/Server');
const Request = require('../js/models/Request');

describe('Least Connections Algorithm', () => {
  let algo;
  let servers;

  beforeEach(() => {
    algo = new LeastConnections();
    servers = [
      new Server('s1', 'Server 1', 10, 1),
      new Server('s2', 'Server 2', 10, 1),
      new Server('s3', 'Server 3', 10, 1)
    ];
  });

  test('selects server with lowest active connection count', () => {
    servers[0].activeConnections = 5;
    servers[1].activeConnections = 2;
    servers[2].activeConnections = 8;

    const req = new Request(1, '10.0.0.1');
    const selected = algo.selectServer(servers, req);
    expect(selected.id).toBe('s2');
  });

  test('skips unhealthy servers even if connections are zero', () => {
    servers[0].activeConnections = 0;
    servers[0].healthy = false;
    servers[1].activeConnections = 3;
    servers[2].activeConnections = 4;

    const req = new Request(1, '10.0.0.1');
    const selected = algo.selectServer(servers, req);
    expect(selected.id).toBe('s2');
  });
});
