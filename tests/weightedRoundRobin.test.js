const WeightedRoundRobin = require('../js/algorithms/weightedRoundRobin');
const Server = require('../js/models/Server');
const Request = require('../js/models/Request');

describe('Weighted Round Robin Algorithm', () => {
  let algo;
  let servers;

  beforeEach(() => {
    algo = new WeightedRoundRobin();
    servers = [
      new Server('s1', 'Server 1', 10, 3), // weight 3
      new Server('s2', 'Server 2', 10, 1)  // weight 1
    ];
  });

  test('routes proportionally to server weights', () => {
    const counts = { s1: 0, s2: 0 };
    for (let i = 0; i < 4; i++) {
      const s = algo.selectServer(servers, new Request(i, '1.2.3.4'));
      counts[s.id]++;
    }

    expect(counts.s1).toBe(3);
    expect(counts.s2).toBe(1);
  });
});
