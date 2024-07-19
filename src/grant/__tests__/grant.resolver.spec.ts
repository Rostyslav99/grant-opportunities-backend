import { Test, TestingModule } from '@nestjs/testing';
import { GrantResolver } from '../grant.resolver';
import { GrantService } from '../grant.service';
import { Grant, GrantStatus } from '../grant.entity';

const mockGrantService = () => ({
  findAll: jest.fn(),
  findNewOpportunities: jest.fn(),
  updateGrantStatus: jest.fn(),
});

describe('GrantResolverTests', () => {
  let resolver: GrantResolver;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrantResolver,
        {
          provide: GrantService,
          useFactory: mockGrantService,
        },
      ],
    }).compile();

    resolver = module.get<GrantResolver>(GrantResolver);
    service = module.get<GrantService>(GrantService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAllGrants', () => {
    it('should return an array of grants', async () => {
      const expectedGrants = [{ id: 1, title: 'Test Grant' }];
      service.findAll.mockReturnValue(expectedGrants);

      const grants = await resolver.getAllGrants();
      expect(grants).toEqual(expectedGrants);
    });
  });

  describe('getNewOpportunities', () => {
    it('should return an array of new opportunities', async () => {
      const expectedGrants = [
        { id: 1, title: 'Test Grant', status: GrantStatus.APPLIED },
      ];
      service.findNewOpportunities.mockReturnValue(expectedGrants);

      const grants = await resolver.getNewOpportunities();
      expect(grants).toEqual(expectedGrants);
    });
  });

  describe('likeGrant', () => {
    it('should return the updated grant', async () => {
      const grant = { id: 1, title: 'Test Grant', status: GrantStatus.APPLIED };
      service.updateGrantStatus.mockReturnValue({
        ...grant,
        status: GrantStatus.ACCEPTED,
      });

      const updatedGrant = await resolver.likeGrant(1);
      expect(updatedGrant.status).toBe(GrantStatus.ACCEPTED);
    });
  });

  describe('dislikeGrant', () => {
    it('should return the updated grant', async () => {
      const grant = { id: 1, title: 'Test Grant', status: GrantStatus.APPLIED };
      service.updateGrantStatus.mockReturnValue({
        ...grant,
        status: GrantStatus.REJECTED,
      });

      const updatedGrant = await resolver.dislikeGrant(1);
      expect(updatedGrant.status).toBe(GrantStatus.REJECTED);
    });
  });
});
