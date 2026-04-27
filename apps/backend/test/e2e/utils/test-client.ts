import { request } from '@playwright/test';

export class TestClient {
  private token?: string;

  async init() {
    this.api = await request.newContext({
      baseURL: 'http://localhost:3000',
    });
  }

  private api;

  setToken(token: string) {
    this.token = token;
  }

  async get(url: string) {
    return this.api.get(url, {
      headers: this.authHeader(),
    });
  }

  async post(url: string, data: any) {
    return this.api.post(url, {
      data,
      headers: this.authHeader(),
    });
  }

  private authHeader() {
    return this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {};
  }
}