import got, { Got, OptionsOfTextResponseBody } from 'got';
import { z } from 'zod';
import {
  zettiEncodeSchema,
  zettiTokenSchema,
  zettiAboutSchema,
  zettiPermissionsSchema,
  zettiPageSchema,
  zettiDetailsPerNodesSchema,
  type ZettiToken
} from '@shared/zetti-schemas';

type OAuthTokenState = {
  encode: string | null;
  token: ZettiToken | null;
  tokenObtainedAt: number | null;
};

export class ZettiClient {
  private httpApi: Got;
  private httpOAuth: Got;
  private state: OAuthTokenState = { encode: null, token: null, tokenObtainedAt: null };
  private minIntervalMs: number;
  private lastRequestAt = 0;

  constructor(
    private readonly apiBase = process.env.ZETTI_API_BASE!,
    private readonly oauthBase = process.env.ZETTI_OAUTH_BASE!,
    private readonly clientId = process.env.ZETTI_CLIENT_ID!,
    private readonly clientSecret = process.env.ZETTI_CLIENT_SECRET!,
    private readonly username = process.env.ZETTI_USERNAME!,
    private readonly password = process.env.ZETTI_PASSWORD!,
    rateLimitQps = Number(process.env.ZETTI_RATE_LIMIT_QPS ?? '8')
  ) {
    this.httpApi = got.extend({ prefixUrl: apiBase, timeout: { request: 15_000 }, retry: { limit: 2 } });
    this.httpOAuth = got.extend({ prefixUrl: oauthBase, timeout: { request: 15_000 }, retry: { limit: 2 } });
    this.minIntervalMs = Math.max(1, Math.floor(1000 / Math.max(1, rateLimitQps)));
  }

  private async throttle() {
    const now = Date.now();
    const wait = this.lastRequestAt + this.minIntervalMs - now;
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    this.lastRequestAt = Date.now();
  }

  private tokenExpiresSoon(): boolean {
    if (!this.state.token || this.state.tokenObtainedAt == null) return true;
    const { expires_in } = this.state.token;
    const obtained = this.state.tokenObtainedAt;
    // refrescar 60s antes
    return Date.now() > obtained + (expires_in - 60) * 1000;
  }

  async getEncodeCredentials(clientId = this.clientId, clientSecret = this.clientSecret) {
    await this.throttle();
    const res = await this.httpOAuth.get('encode', {
      searchParams: { client_id: clientId, client_secret: clientSecret }
    }).json();
    const parsed = zettiEncodeSchema.parse(res);
    this.state.encode = parsed.encode;
    return parsed;
  }

  async tokenWithPassword(encode = this.state.encode!, username = this.username, password = this.password) {
    await this.throttle();
    const form = new URLSearchParams({ grant_type: 'password', username, password });
    const res = await this.httpOAuth
      .post('oauth/token', {
        headers: { Authorization: `Basic ${encode}` },
        body: form.toString(),
        hooks: { beforeRequest: [this.asFormUrlEncoded] }
      })
      .json();
    const token = zettiTokenSchema.parse(res);
    this.state.token = token;
    this.state.tokenObtainedAt = Date.now();
    return token;
  }

  async tokenWithRefresh(encode = this.state.encode!, refreshToken: string) {
    await this.throttle();
    const form = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken });
    const res = await this.httpOAuth
      .post('oauth/token', {
        headers: { Authorization: `Basic ${encode}` },
        body: form.toString(),
        hooks: { beforeRequest: [this.asFormUrlEncoded] }
      })
      .json();
    const token = zettiTokenSchema.parse(res);
    this.state.token = token;
    this.state.tokenObtainedAt = Date.now();
    return token;
  }

  private asFormUrlEncoded(options: OptionsOfTextResponseBody) {
    options.headers = { ...(options.headers || {}), 'content-type': 'application/x-www-form-urlencoded' };
  }

  private async ensureAccessToken() {
    if (!this.state.encode) await this.getEncodeCredentials();
    if (!this.state.token || this.tokenExpiresSoon()) {
      if (this.state.token?.refresh_token) {
        await this.tokenWithRefresh(this.state.encode!, this.state.token.refresh_token);
      } else {
        await this.tokenWithPassword(this.state.encode!, this.username, this.password);
      }
    }
  }

  private async apiGet<T>(url: string, schema: z.ZodType<T>, opts: any = {}): Promise<T> {
    await this.ensureAccessToken();
    await this.throttle();
    try {
      const res = await this.httpApi.get(url, {
        ...opts,
        headers: { Authorization: `Bearer ${this.state.token!.access_token}`, ...(opts.headers || {}) }
      }).json();
      return schema.parse(res);
    } catch (err: any) {
      if (err.response?.statusCode === 401 || err.response?.statusCode === 403) {
        if (this.state.token?.refresh_token) await this.tokenWithRefresh(this.state.encode!, this.state.token.refresh_token);
        else await this.tokenWithPassword();
        const res2 = await this.httpApi.get(url, {
          ...opts,
          headers: { Authorization: `Bearer ${this.state.token!.access_token}`, ...(opts.headers || {}) }
        }).json();
        return schema.parse(res2);
      }
      throw err;
    }
  }

  private async apiPost<T>(url: string, body: unknown, schema: z.ZodType<T>, opts: any = {}): Promise<T> {
    await this.ensureAccessToken();
    await this.throttle();
    try {
      const res = await this.httpApi.post(url, {
        ...opts,
        json: body,
        headers: { Authorization: `Bearer ${this.state.token!.access_token}`, ...(opts.headers || {}) }
      }).json();
      return schema.parse(res);
    } catch (err: any) {
      if (err.response?.statusCode === 401 || err.response?.statusCode === 403) {
        if (this.state.token?.refresh_token) await this.tokenWithRefresh(this.state.encode!, this.state.token.refresh_token);
        else await this.tokenWithPassword();
        const res2 = await this.httpApi.post(url, {
          ...opts,
          json: body,
          headers: { Authorization: `Bearer ${this.state.token!.access_token}`, ...(opts.headers || {}) }
        }).json();
        return schema.parse(res2);
      }
      throw err;
    }
  }

  // REST según Swagger (tipado con Zod)
  about() {
    return this.apiGet('/about', zettiAboutSchema);
  }

  userPermissions(nodeId: string | number) {
    return this.apiGet(`/user/me/permissions/${nodeId}`, zettiPermissionsSchema);
  }

  searchProductsByGroup(nodeId: string | number, idsGroups: number[], page = 0, size = Number(process.env.ZETTI_PAGE_SIZE ?? '500')) {
    const body = { idsGroups, page, size };
    return this.apiPost(`/v2/${nodeId}/products/search`, body, zettiPageSchema);
  }

  searchProductsByActualization(nodeId: string | number, from: string, to: string, page = 0, size = Number(process.env.ZETTI_PAGE_SIZE ?? '500')) {
    const body = { actualizationDateFrom: from, actualizationDateTo: to, page, size };
    return this.apiPost(`/v2/${nodeId}/products/search`, body, zettiPageSchema);
  }

  detailsPerNodes(nodeId: string | number, nodeFarmaciaIds: (string|number)[], productIds: (string|number)[]) {
    const body = { nodeIds: nodeFarmaciaIds, productIds };
    return this.apiPost(`/${nodeId}/products/details-per-nodes`, body, zettiDetailsPerNodesSchema);
  }
}


