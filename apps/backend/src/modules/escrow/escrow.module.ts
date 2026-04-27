import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleModule } from '@nestjs/schedule';
import { Escrow } from './entities/escrow.entity';
import { Party } from './entities/party.entity';
import { Condition } from './entities/condition.entity';
import { EscrowEvent } from './entities/escrow-event.entity';

import { EscrowController } from './controllers/escrow.controller';
import { EscrowSchedulerController } from './controllers/escrow-scheduler.controller';

import { EscrowAccessGuard } from './guards/escrow-access.guard';

// ✅ New decomposed services
import { EscrowLifecycleService } from './services/escrow-lifecycle.service';
import { EscrowFundingService } from './services/escrow-funding.service';
import { EscrowDisputeService } from './services/escrow-dispute.service';
import { EscrowQueryService } from './services/escrow-query.service';

// ✅ Optional orchestrator (keeps backward compatibility for controller)
import { EscrowFacadeService } from './services/escrow-facade.service';

import { EscrowSchedulerService } from './services/escrow-scheduler.service';
import { EscrowStellarIntegrationService } from './services/escrow-stellar-integration.service';

import { AuthModule } from '../auth/auth.module';
import { StellarModule } from '../stellar/stellar.module';

import { Dispute } from './entities/dispute.entity';
import { EscrowService } from './services/escrow.service';
import { EscrowSchedulerService } from './services/escrow-scheduler.service';
import { EscrowController } from './controllers/escrow.controller';
import { EscrowSchedulerController } from './controllers/escrow-scheduler.controller';
import { EventsController } from './controllers/events.controller';
import { EscrowAccessGuard } from './guards/escrow-access.guard';
import { EscrowExpireGuard } from './guards/escrow-expire.guard';
import { AuthModule } from '../auth/auth.module';
import { EscrowStellarIntegrationService } from './services/escrow-stellar-integration.service';
import { WebhookModule } from '../webhook/webhook.module';
import { IpfsModule } from '../ipfs/ipfs.module';
import { User } from '../user/entities/user.entity';
import { AllowedAsset } from '../assets/entities/allowed-asset.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Escrow,
      Party,
      Condition,
      EscrowEvent,
      Dispute,
      User,
      AllowedAsset,
    ]),
    AuthModule,
    WebhookModule,
    IpfsModule,
  ],

  controllers: [
    EscrowController,
    EscrowSchedulerController,
  ],

  controllers: [EscrowController, EscrowSchedulerController, EventsController],
  providers: [
    // ✅ Core domain services (decomposed)
    EscrowLifecycleService,
    EscrowFundingService,
    EscrowDisputeService,
    EscrowQueryService,

    // ✅ Facade (keeps existing controller API unchanged)
    EscrowFacadeService,

    // ✅ Infra / supporting services
    EscrowSchedulerService,
    EscrowStellarIntegrationService,

    // ✅ Guards
    EscrowAccessGuard,
    EscrowExpireGuard,
  ],

  exports: [
    // Export only what external modules should use
    EscrowFacadeService,        // main entry point
    EscrowQueryService,         // often reused
    EscrowSchedulerService,
  ],
})
export class EscrowModule {}