const Random = require('../js/algorithms/random');
const Server = require('../js/models/Server');
const Request = require('../js/models/Request');

describe('Random Load Balancing Algorithm', () => {
  let algo;
  let servers;

  beforeEach(() => {
    algo = new Random();
    servers = [
      new Server('s1', 'Server 1', 10, 1),
      new Server('s2', 'Server 2', 10, 1)
    ];
  });

  test('selects from healthy servers', () => {
    servers[0].healthy = false;
    const req = new Request(1, '1.2.3.4');
    const selected = algo.selectServer(servers, req);
    expect(selected.id).toBe('s2');
  });
});
