import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrantService } from '../grant.service';
import { Grant, GrantStatus } from '../grant.entity';

const mockGrantRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('GrantServiceTests', () => {
  let service: GrantService;
  let grantRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrantService,
        {
          provide: getRepositoryToken(Grant),
          useFactory: mockGrantRepository,
        },
      ],
    }).compile();

    service = module.get<GrantService>(GrantService);
    grantRepository = module.get<MockRepository>(getRepositoryToken(Grant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of grants', async () => {
      const expectedGrants = [{ id: 1, title: 'Test Grant' }];
      grantRepository.find.mockReturnValue(expectedGrants);

      const grants = await service.findAll();
      expect(grants).toEqual(expectedGrants);
    });
  });

  describe('findNewOpportunities', () => {
    it('should return an array of new opportunities', async () => {
      const expectedGrants = [
        { id: 1, title: 'Test Grant', status: GrantStatus.APPLIED },
      ];
      grantRepository.find.mockReturnValue(expectedGrants);

      const grants = await service.findNewOpportunities();
      expect(grants).toEqual(expectedGrants);
    });
  });

  describe('updateGrantStatus', () => {
    it('should update the grant status', async () => {
      const grant = { id: 1, title: 'Test Grant', status: GrantStatus.APPLIED };
      grantRepository.findOne.mockReturnValue(grant);
      grantRepository.save.mockReturnValue({
        ...grant,
        status: GrantStatus.ACCEPTED,
      });

      const updatedGrant = await service.updateGrantStatus(
        1,
        GrantStatus.ACCEPTED,
      );
      expect(updatedGrant.status).toBe(GrantStatus.ACCEPTED);
    });
  });
});
