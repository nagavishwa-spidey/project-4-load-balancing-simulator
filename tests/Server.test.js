const Server = require('../js/models/Server');
const Request = require('../js/models/Request');

describe('Server Model', () => {
  let server;

  beforeEach(() => {
    server = new Server('s1', 'Server 1', 10, 2);
  });

  test('initializes with expected default values', () => {
    expect(server.id).toBe('s1');
    expect(server.name).toBe('Server 1');
    expect(server.capacity).toBe(10);
    expect(server.weight).toBe(2);
    expect(server.healthy).toBe(true);
    expect(server.activeConnections).toBe(0);
  });

  test('manages request lifecycle and load percentage', () => {
    const req = new Request(1, '10.0.0.1');
    server.addRequest(req);
    expect(server.activeConnections).toBe(1);
    expect(server.totalRequests).toBe(1);
    expect(server.getLoad()).toBe(10); // 1 / 10 * 100%

    server.completeRequest(1);
    expect(server.activeConnections).toBe(0);
  });

  test('toggles health status', () => {
    expect(server.healthy).toBe(true);
    server.toggleHealth();
    expect(server.healthy).toBe(false);
  });
});
