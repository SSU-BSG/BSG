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

jest.mock('typeorm-transactional', () => ({
  Transactional: () => (_t: any, _k: string, d: PropertyDescriptor) => d,
  initializeTransactionalContext: jest.fn(),
  resetTransactionalContext: jest.fn(),
  addTransactionalDataSource: jest.fn(),
}));

describe('MatchService', () => {
  let service: MatchService;''
  let matchRepo: jest.Mocked<MatchRepository>;
  let groupRepo: jest.Mocked<MatchGroupRepository>;
  let memberRepo: jest.Mocked<MatchGroupMemberRepository>;
  let userRepo: jest.Mocked<UserRepository>;

  const mockMatchRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findWaitingByUserId: jest.fn(),
    findAllWaiting: jest.fn(),
    markAsMatchedByUids: jest.fn(),
  };

  const mockGroupRepo = {
    createGroup: jest.fn(),
  };

  const mockMemberRepo = {
    addMembers: jest.fn(),
  };

  const mockUserRepo = {
    findOneById: jest.fn(),
    findByIds: jest.fn(),
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

    matchRepo.findAllWaiting.mockResolvedValue([]);
    await service.onModuleInit();

    jest.clearAllMocks();
  });

  describe('createMatch', () => {
    it('매칭 인원이 부족할 경우, 대기열에만 추가하고 성공적으로 등록되어야 한다', async () => {
      const user = { id: 1 } as UserEntity;
      const dto: CreateMatchRequest = { wantedMatchCount: 2 };
      const createdMatch = { user, ...dto } as Match;
      const connectMatchSpy = jest.spyOn(service, 'connectMatch');

      userRepo.findOneById.mockResolvedValue(user);
      matchRepo.create.mockReturnValue(createdMatch);
      matchRepo.save.mockResolvedValue(createdMatch);

      const result = await service.createMatch(user.id, dto);

      expect(result).toBe('매칭 등록 완료');
      expect(userRepo.findOneById).toHaveBeenCalledWith(1);
      expect(matchRepo.save).toHaveBeenCalledWith(createdMatch);
      expect(connectMatchSpy).not.toHaveBeenCalled();
    });

    it('매칭 인원이 충족될 경우, connectMatch를 호출해야 한다', async () => {
      const user1 = { id: 1 } as UserEntity;
      const user2 = { id: 2 } as UserEntity;
      const dto: CreateMatchRequest = { wantedMatchCount: 2 };
      const connectMatchSpy = jest
        .spyOn(service, 'connectMatch')
        .mockResolvedValue(undefined);

      await service.createMatch(user1.id, dto);
      await service.createMatch(user2.id, dto);

      expect(connectMatchSpy).toHaveBeenCalledWith(2);
    });

    it('유저를 찾을 수 없으면 UserNotFoundException을 던져야 한다', async () => {
      userRepo.findOneById.mockResolvedValue(null);
      const dto: CreateMatchRequest = { wantedMatchCount: 2 };

      await expect(service.createMatch(999, dto)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('cancelMatch', () => {
    it('매칭 취소에 성공해야 한다', async () => {
      const targetMatch = {
        id: 20,
        status: MatchStatus.WAITING,
        wantedMatchCount: 2,
        user: { id: 1 } as UserEntity,
      } as Match;

      matchRepo.findWaitingByUserId.mockResolvedValue(targetMatch);
      matchRepo.save.mockImplementation(async (match) => match as Match);

      const result = await service.cancelMatch(1);

      expect(result).toBe('매칭 취소 완료');
      expect(matchRepo.findWaitingByUserId).toHaveBeenCalledWith(1);
      expect(matchRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: MatchStatus.CANCELED,
        }),
      );
    });

    it('대기중인 매칭이 없으면 CannotFoundMatchException을 던져야 한다', async () => {
      matchRepo.findWaitingByUserId.mockResolvedValue(null);

      await expect(service.cancelMatch(1)).rejects.toThrow(
        CannotFoundMatchException,
      );
    });
  });

  describe('connectMatch', () => {
    it('성공적으로 매칭 그룹을 생성해야 한다', async () => {
      const userA = { id: 100 } as UserEntity;
      const userB = { id: 200 } as UserEntity;
      const userIds = [userA.id, userB.id];
      const group = { id: 99 } as any;

      const queue = service['waitingQueues'].set(2, [...userIds]);

      userRepo.findByIds.mockResolvedValue([userA, userB]);
      groupRepo.createGroup.mockResolvedValue(group);

      await service.connectMatch(2);

      expect(userRepo.findByIds).toHaveBeenCalledWith(userIds);
      expect(groupRepo.createGroup).toHaveBeenCalled();
      expect(memberRepo.addMembers).toHaveBeenCalledWith(group, [userA, userB]);
      expect(matchRepo.markAsMatchedByUids).toHaveBeenCalledWith(userIds);
      expect(queue.get(2)).toEqual([]);
    });
  });
});