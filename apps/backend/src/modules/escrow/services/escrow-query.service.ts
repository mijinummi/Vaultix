import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EscrowEntity } from '../entities/escrow.entity';

@Injectable()
export class EscrowQueryService {
  constructor(
    @InjectRepository(EscrowEntity)
    private readonly repo: Repository<EscrowEntity>,
  ) {}

  findAll(page = 1, limit = 20) {
    return this.repo.find({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findOverview(userId: string) {
    const [active, completed] = await Promise.all([
      this.repo.count({ where: { senderUserId: userId, status: 'FUNDED' } }),
      this.repo.count({ where: { senderUserId: userId, status: 'RELEASED' } }),
    ]);

    return { active, completed };
  }

  search(query: string) {
    return this.repo
      .createQueryBuilder('e')
      .where('e.description ILIKE :q', { q: `%${query}%` })
      .getMany();
  }
}