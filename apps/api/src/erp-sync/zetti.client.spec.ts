import { ZettiClient } from './zetti.client';

jest.mock('got', () => {
  const mk = (data: any) => ({ json: async () => data });
  const instance = {
    get: jest.fn().mockResolvedValue(mk({ encode: 'ENC' })),
    post: jest.fn().mockResolvedValue(mk({ access_token: 'AT', token_type: 'bearer', expires_in: 3600, refresh_token: 'RT' }))
  };
  return { __esModule: true, default: { extend: () => instance } };
});

describe('ZettiClient', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, ZETTI_API_BASE: 'https://demo.zetti.com.ar/api-rest', ZETTI_OAUTH_BASE: 'https://demo.zetti.com.ar/oauth-server', ZETTI_CLIENT_ID: 'cid', ZETTI_CLIENT_SECRET: 'sec', ZETTI_USERNAME: 'u', ZETTI_PASSWORD: 'p', ZETTI_RATE_LIMIT_QPS: '100' };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('gets encode and token (password)', async () => {
    const c = new ZettiClient();
    const enc = await c.getEncodeCredentials('cid', 'sec');
    expect(enc.encode).toBe('ENC');
    const tok = await c.tokenWithPassword('ENC', 'u', 'p');
    expect(tok.access_token).toBe('AT');
    expect(tok.refresh_token).toBe('RT');
  });
});


