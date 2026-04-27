import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EscrowEntity } from '../entities/escrow.entity';
import { EscrowStateMachine } from '../escrow-state-machine';

@Injectable()
export class EscrowFundingService {
  constructor(private readonly dataSource: DataSource) {}

  async fundEscrow(escrowId: string) {
    return this.dataSource.transaction(async (manager) => {
      const escrow = await manager.findOne(EscrowEntity, { where: { id: escrowId } });
      if (!escrow) throw new NotFoundException();

      EscrowStateMachine.assertTransition(escrow.status, 'FUNDED');

      escrow.status = 'FUNDED';
      escrow.fundedAt = new Date();

      return manager.save(escrow);
    });
  }

  async releaseEscrow(escrowId: string, actorId: string) {
    return this.dataSource.transaction(async (manager) => {
      const escrow = await manager.findOne(EscrowEntity, { where: { id: escrowId } });
      if (!escrow) throw new NotFoundException();

      EscrowStateMachine.assertTransition(escrow.status, 'RELEASED');

      escrow.status = 'RELEASED';
      escrow.releasedAt = new Date();
      escrow.releasedByUserId = actorId;

      return manager.save(escrow);
    });
  }

  async refundEscrow(escrowId: string) {
    return this.dataSource.transaction(async (manager) => {
      const escrow = await manager.findOne(EscrowEntity, { where: { id: escrowId } });
      if (!escrow) throw new NotFoundException();

      EscrowStateMachine.assertTransition(escrow.status, 'REFUNDED');

      escrow.status = 'REFUNDED';
      escrow.refundedAt = new Date();

      return manager.save(escrow);
    });
  }
}