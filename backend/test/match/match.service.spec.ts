import { Test, TestingModule } from '@nestjs/testing';
import {
    CannotFoundMatchException,
    UserNotFoundException,
} from '../../src/exception';
import { CreateMatchRequest } from '../../src/match/dto/match.dto';
import { Match, MatchStatus } from '../../src/match/entity/match.entity';
import { MatchService } from '../../src/match/match.service';
import { MatchRepository } from '../../src/match/repository/match.repository';
import { MatchGroupRepository } from '../../src/match/repository/matchGroup.repository';
import { MatchGroupMemberRepository } from '../../src/match/repository/matchGroupMember.repository';
import { UserEntity } from '../../src/user/user.entity';
import { UserRepository } from '../../src/user/user.repository';

type Mocked<T> = jest.Mocked<T>;
jest.mock('typeorm-transactional', () => ({
  Transactional: () => (_t: any, _k: string, d: PropertyDescriptor) => d,
  initializeTransactionalContext: jest.fn(),
  resetTransactionalContext: jest.fn(),
  addTransactionalDataSource: jest.fn(),
}));
describe('MatchService', () => {
  let service: MatchService;
  let matchRepo: Mocked<MatchRepository>;
  let groupRepo: Mocked<MatchGroupRepository>;
  let memberRepo: Mocked<MatchGroupMemberRepository>;
  let userRepo: Mocked<UserRepository>;

  const mockMatchRepo: Partial<Mocked<MatchRepository>> = {
    create: jest.fn(),
    save: jest.fn(),
    findWaitingByUserId: jest.fn(),
    findOldestWaiting: jest.fn(),
    markAsMatched: jest.fn(),
    findDistinctWaitingCounts: jest.fn(),
  };

  const mockGroupRepo: Partial<Mocked<MatchGroupRepository>> = {
    createGroup: jest.fn(),
  };

  const mockMemberRepo: Partial<Mocked<MatchGroupMemberRepository>> = {
    addMembers: jest.fn(),
  };

  const mockUserRepo: Partial<Mocked<UserRepository>> = {
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        { provide: MatchRepository, useValue: mockMatchRepo },
        { provide: MatchGroupRepository, useValue: mockGroupRepo },
        { provide: MatchGroupMemberRepository, useValue: mockMemberRepo },
        { provide: UserRepository, useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get(MatchService);
    matchRepo = module.get(MatchRepository);
    groupRepo = module.get(MatchGroupRepository);
    memberRepo = module.get(MatchGroupMemberRepository);
    userRepo = module.get(UserRepository);

    jest.clearAllMocks();
  });

  describe('createMatch', () => {
    it('createMatch_success', async () => {
      const user: Partial<UserEntity> = { id: 1 } as UserEntity;
      const dto: CreateMatchRequest = { wantedMatchCount: 3 };

      userRepo.findOneById.mockResolvedValue(user as UserEntity);

      const created = {
        id: 10,
        user,
        wantedMatchCount: dto.wantedMatchCount,
        status: MatchStatus.WAITING,
      } as Match;

      matchRepo.create.mockReturnValue(created);
      matchRepo.save.mockResolvedValue(created);

      const res = await service.createMatch(1, dto);

      expect(res).toBe('매칭 등록 완료');
      expect(userRepo.findOneById).toHaveBeenCalledWith(1);
      expect(matchRepo.create).toHaveBeenCalledWith({
        user,
        wantedMatchCount: 3,
        status: MatchStatus.WAITING,
      });
      expect(matchRepo.save).toHaveBeenCalledWith(created);
    });

    it('creatMatch_failed', async () => {
      userRepo.findOneById.mockResolvedValue(null);

      await expect(
        service.createMatch(999, { wantedMatchCount: 2 }),
      ).rejects.toThrow(UserNotFoundException);
      expect(matchRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('cancelMatch', () => {
    it('cancelMatch_success', async () => {
      const user: Partial<UserEntity> = { id: 1 } as UserEntity;
      const waiting: Partial<Match> = {
        id: 20,
        status: MatchStatus.WAITING,
      } as Match;

      userRepo.findOneById.mockResolvedValue(user as UserEntity);
      matchRepo.findWaitingByUserId.mockResolvedValue(waiting as Match);
      matchRepo.save.mockResolvedValue({
        ...waiting,
        status: MatchStatus.CANCELED,
      } as Match);

      const res = await service.cancelMatch(1);

      expect(res).toBe('매칭 취소 완료');
      expect(matchRepo.findWaitingByUserId).toHaveBeenCalledWith(1);
      expect(matchRepo.save).toHaveBeenCalledWith({
        ...waiting,
        status: MatchStatus.CANCELED,
      });
    });

    it('cancelMatch_failed', async () => {
      userRepo.findOneById.mockResolvedValue({ id: 1 } as UserEntity);
      matchRepo.findWaitingByUserId.mockResolvedValue(null);

      await expect(service.cancelMatch(1)).rejects.toThrow(
        CannotFoundMatchException,
      );
      expect(matchRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('connectMatch', () => {
    it('connectMatch_success_nothing_to_connect', async () => {
      matchRepo.findOldestWaiting.mockResolvedValue([{ id: 1 } as Match]); // length 1
      await service.connectMatch(2);

      expect(groupRepo.createGroup).not.toHaveBeenCalled();
      expect(memberRepo.addMembers).not.toHaveBeenCalled();
      expect(matchRepo.markAsMatched).not.toHaveBeenCalled();
    });

    it('connectMatch_success_connecting_group', async () => {
      const userA = { id: 100 } as UserEntity;
      const userB = { id: 200 } as UserEntity;
      const m1 = { id: 11, user: userA } as Match;
      const m2 = { id: 22, user: userB } as Match;

      matchRepo.findOldestWaiting.mockResolvedValue([m1, m2]);
      groupRepo.createGroup.mockResolvedValue({ id: 99 } as any);
      memberRepo.addMembers.mockResolvedValue();

      matchRepo.markAsMatched.mockResolvedValue();

      await service.connectMatch(2);

      expect(groupRepo.createGroup).toHaveBeenCalled();
      expect(memberRepo.addMembers).toHaveBeenCalledWith({ id: 99 }, [
        userA,
        userB,
      ]);
      expect(matchRepo.markAsMatched).toHaveBeenCalledWith([11, 22]);
    });
  });

  describe('connectAllMatches', () => {
    it('connectAllMatches_success', async () => {
      const spy = jest
        .spyOn(service, 'connectMatch')
        .mockResolvedValue(undefined);

      matchRepo.findDistinctWaitingCounts.mockResolvedValue([2, 3, 4]);

      await service.connectAllMatches();

      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenNthCalledWith(1, 2);
      expect(spy).toHaveBeenNthCalledWith(2, 3);
      expect(spy).toHaveBeenNthCalledWith(3, 4);
    });
  });
});
