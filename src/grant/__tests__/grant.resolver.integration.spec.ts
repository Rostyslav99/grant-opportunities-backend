import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrantResolver } from '../grant.resolver';
import { GrantService } from '../grant.service';
import { Grant } from '../grant.entity';
import { Connection } from 'typeorm';
import { GrantStatus } from '../grant.entity';

const seedCount = 15;

describe('GrantResolver Integration', () => {
  let resolver: GrantResolver;
  let service: GrantService;
  let connection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Grant],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Grant]),
      ],
      providers: [GrantResolver, GrantService],
    }).compile();

    resolver = module.get<GrantResolver>(GrantResolver);
    service = module.get<GrantService>(GrantService);
    connection = module.get<Connection>(Connection);
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
    await seedDatabase();
  });

  async function seedDatabase() {
    const existingGrants = await service.findAll();
    if (existingGrants.length === 0) {
      await service.seedDatabase(seedCount);
    }
  }

  it('should return all grants', async () => {
    const grants = await resolver.getAllGrants();
    expect(grants).toHaveLength(seedCount);
  });

  it('should return new grant opportunities', async () => {
    const grants = await resolver.getAllGrants();

    const newOpportunities = await resolver.getNewOpportunities();
    expect(newOpportunities).toHaveLength(
      grants.filter((grant) => grant.status === 'APPLIED').length,
    );
  });

  it('should accept a grant', async () => {
    const grants = await service.findAll();
    const grantToAccept = grants.find((g) => g.status === GrantStatus.APPLIED);

    if (grantToAccept) {
      const acceptedGrant = await resolver.likeGrant(
        grantToAccept.id,
        'Accepted',
      );
      expect(acceptedGrant.status).toEqual(GrantStatus.ACCEPTED);
    } else {
      fail('No grant with status APPLIED found to accept');
    }
  });

  it('should reject a grant', async () => {
    const grants = await service.findAll();
    const grantToReject = grants.find((g) => g.status === GrantStatus.APPLIED);

    if (grantToReject) {
      const rejectedGrant = await resolver.dislikeGrant(
        grantToReject.id,
        'Rejected',
      );
      expect(rejectedGrant.status).toEqual(GrantStatus.REJECTED);
    } else {
      fail('No grant with status APPLIED found to reject');
    }
  });
});
