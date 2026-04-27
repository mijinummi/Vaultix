export class StellarMock {
  async submitTransaction() {
    return { hash: 'mock_hash', success: true };
  }

  async getBalance() {
    return 1000;
  }
}