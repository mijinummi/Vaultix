import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../../src/app.module';

export async function createTestApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider('StellarService')
    .useValue(require('./mocks/stellar.mock').stellarMock)
    .overrideProvider('BlockchainService')
    .useValue(require('./mocks/blockchain.mock').blockchainMock)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return app;
}