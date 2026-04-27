import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EscrowEntity } from '../entities/escrow.entity';
import { DisputeEntity } from '../../disputes/entities/dispute.entity';
import { EscrowStateMachine } from '../escrow-state-machine';

@Injectable()
export class EscrowDisputeService {
  constructor(private readonly dataSource: DataSource) {}

  async fileDispute(escrowId: string, userId: string, reason: string) {
    return this.dataSource.transaction(async (manager) => {
      const escrow = await manager.findOne(EscrowEntity, { where: { id: escrowId } });
      if (!escrow) throw new NotFoundException();

      EscrowStateMachine.assertTransition(escrow.status, 'DISPUTED');

      const dispute = manager.create(DisputeEntity, {
        subjectId: escrowId,
        subjectType: 'ESCROW',
        initiatorUserId: userId,
        reason,
        status: 'OPEN',
      });

      await manager.save(dispute);

      escrow.status = 'DISPUTED';
      escrow.disputeId = dispute.id;

      await manager.save(escrow);

      return dispute;
    });
  }

  async resolveDispute(escrowId: string, resolution: 'RELEASE' | 'REFUND') {
    return this.dataSource.transaction(async (manager) => {
      const escrow = await manager.findOne(EscrowEntity, { where: { id: escrowId } });
      if (!escrow) throw new NotFoundException();

      if (escrow.status !== 'DISPUTED') {
        throw new ConflictException('Escrow is not disputed');
      }

      const nextState = resolution === 'RELEASE' ? 'RELEASED' : 'REFUNDED';

      EscrowStateMachine.assertTransition(escrow.status, nextState);

      escrow.status = nextState;

      return manager.save(escrow);
    });
  }
}