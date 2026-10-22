const IpHash = require('../js/algorithms/ipHash');
const Server = require('../js/models/Server');
const Request = require('../js/models/Request');

describe('IP Hash Algorithm', () => {
  let algo;
  let servers;

  beforeEach(() => {
    algo = new IpHash();
    servers = [
      new Server('s1', 'Server 1', 10, 1),
      new Server('s2', 'Server 2', 10, 1),
      new Server('s3', 'Server 3', 10, 1)
    ];
  });

  test('hashes same IP address consistently to same server', () => {
    const ip = '198.51.100.42';
    const req1 = new Request(1, ip);
    const req2 = new Request(2, ip);

    const s1 = algo.selectServer(servers, req1);
    const s2 = algo.selectServer(servers, req2);

    expect(s1.id).toBe(s2.id);
  });
});
