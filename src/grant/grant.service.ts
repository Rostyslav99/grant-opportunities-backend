import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant, GrantStatus } from './grant.entity';

@Injectable()
export class GrantService implements OnModuleInit {
  constructor(
    @InjectRepository(Grant)
    private grantsRepository: Repository<Grant>,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  async seedDatabase(seedCount?: number) {
    const existingGrants = await this.grantsRepository.count();

    if (existingGrants > 0) {
      return;
    }

    const numberOfRows = seedCount || 50;

    const statuses = Object.values(GrantStatus);
    const grants = [];
    for (let i = 1; i <= numberOfRows; i++) {
      grants.push({
        title: `Grant ${i}`,
        description: `Description for Grant ${i}`,
        deadlineDate: new Date(),
        matchDate: new Date(),
        avgAmount: Math.floor(Math.random() * 100000) + 1000,
        location: `Location ${i}`,
        companyName: `Company NAME ${i}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }

    for (const grant of grants) {
      await this.grantsRepository.save(grant);
    }
  }

  async findAll(): Promise<Grant[]> {
    return this.grantsRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findNewOpportunities(): Promise<Grant[]> {
    return this.grantsRepository.find({
      where: { status: GrantStatus.APPLIED },
      order: {
        id: 'ASC',
      },
    });
  }

  async updateGrantStatus(
    id: number,
    status: GrantStatus,
    feedback?: string,
  ): Promise<Grant> {
    const grant = await this.grantsRepository.findOne({ where: { id } });
    if (grant) {
      grant.status = status;
      grant.feedback = feedback;
      await this.grantsRepository.save(grant);
    }
    return grant;
  }
}
