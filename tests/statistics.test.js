const Statistics = require('../js/utils/statistics');
const Server = require('../js/models/Server');

describe('Statistics Module', () => {
  let servers;

  beforeEach(() => {
    servers = [
      new Server('s1', 'Server 1', 10, 1),
      new Server('s2', 'Server 2', 10, 1)
    ];
    servers[0].totalRequests = 10;
    servers[1].totalRequests = 10;
  });

  test('calculates distribution percentage', () => {
    const dist = Statistics.calculateDistribution(servers);
    expect(dist.find(d => d.serverId === 's1').percentage).toBe(50);
    expect(dist.find(d => d.serverId === 's2').percentage).toBe(50);
  });

  test('calculates standard deviation for even distribution', () => {
    const stdDev = Statistics.calculateStdDeviation(servers);
    expect(stdDev).toBe(0);
  });
});
