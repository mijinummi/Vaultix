export const stellarMock = {
  createEscrow: async () => ({
    txHash: 'mock_tx_hash',
    status: 'SUCCESS',
  }),

  releaseFunds: async () => ({
    txHash: 'mock_release_hash',
  }),
};