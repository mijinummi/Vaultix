import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EscrowEntity } from '../entities/escrow.entity';
import { EscrowStateMachine } from '../escrow-state-machine';

@Injectable()
export class EscrowLifecycleService {
  constructor(private readonly dataSource: DataSource) {}

  async createEscrow(payload: Partial<EscrowEntity>): Promise<EscrowEntity> {
    return this.dataSource.transaction(async (manager) => {
      const escrow = manager.create(EscrowEntity, {
        ...payload,
        status: 'PENDING_FUNDING',
      });

      return manager.save(escrow);
    });
  }

  async cancelEscrow(escrowId: string, actorId: string) {
    return this.dataSource.transaction(async (manager) => {
      const escrow = await manager.findOne(EscrowEntity, { where: { id: escrowId } });
      if (!escrow) throw new NotFoundException('Escrow not found');

      EscrowStateMachine.assertTransition(escrow.status, 'CANCELLED');

      if (escrow.senderUserId !== actorId) {
        throw new ConflictException('Only sender can cancel escrow');
      }

      escrow.status = 'CANCELLED';
      escrow.cancelledAt = new Date();

      return manager.save(escrow);
    });
  }

  async expireEscrow(escrowId: string) {
    return this.dataSource.transaction(async (manager) => {
      const escrow = await manager.findOne(EscrowEntity, { where: { id: escrowId } });
      if (!escrow) throw new NotFoundException();

      EscrowStateMachine.assertTransition(escrow.status, 'EXPIRED');

      escrow.status = 'EXPIRED';
      escrow.expiredAt = new Date();

      return manager.save(escrow);
    });
  }
}