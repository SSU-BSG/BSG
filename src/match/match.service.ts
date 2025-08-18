import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  CannotFoundMatchException,
  UserNotFoundException,
} from 'src/exception';
import { Transactional } from 'typeorm-transactional';
import { UserRepository } from './../user/user.repository';
import { CreateMatchRequest } from './dto/match.dto';
import { MatchStatus } from './entity/match.entity';
import { MatchRepository } from './repository/match.repository';
import { MatchGroupRepository } from './repository/matchGroup.repository';
import { MatchGroupMemberRepository } from './repository/matchGroupMember.repository';

@Injectable()
export class MatchService implements OnModuleInit {
  private readonly waitingQueues: Map<number, number[]> = new Map();

  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchGroupRepository: MatchGroupRepository,
    private readonly matchGroupMemberRepository: MatchGroupMemberRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async onModuleInit() {
    console.log('매칭 모듈 초기화: 대기열을 DB와 동기화합니다.');
    const waitingMatches = await this.matchRepository.findAllWaiting();

    waitingMatches.forEach((match) => {
      const queue = this.waitingQueues.get(match.wantedMatchCount) || [];
      queue.push(match.user.id);
      this.waitingQueues.set(match.wantedMatchCount, queue);
    });
  }

  async createMatch(
    userId: number,
    createMatchRequest: CreateMatchRequest,
  ): Promise<string> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new UserNotFoundException('유저정보가 존재하지 않습니다.');
    }

    const match = this.matchRepository.create({
      user,
      wantedMatchCount: createMatchRequest.wantedMatchCount,
      status: MatchStatus.WAITING,
    });
    await this.matchRepository.save(match);

    const count = createMatchRequest.wantedMatchCount;
    const queue = this.waitingQueues.get(count) || [];
    queue.push(userId);
    this.waitingQueues.set(count, queue);

    if (queue.length >= count) {
      await this.connectMatch(count);
    }

    return '매칭 등록 완료';
  }

  async cancelMatch(userId: number): Promise<string> {
    const targetMatch = await this.matchRepository.findWaitingByUserId(userId);
    if (!targetMatch) {
      throw new CannotFoundMatchException('현재 대기중인 매칭이 없습니다.');
    }
    targetMatch.status = MatchStatus.CANCELED;
    await this.matchRepository.save(targetMatch);

    const count = targetMatch.wantedMatchCount;
    const queue = this.waitingQueues.get(count) || [];
    const updatedQueue = queue.filter((id) => id !== userId);
    this.waitingQueues.set(count, updatedQueue);

    return '매칭 취소 완료';
  }

  @Transactional()
  async connectMatch(count: number): Promise<void> {
    const queue = this.waitingQueues.get(count);
    if (!queue || queue.length < count) return;

    const matchedUserIds = queue.splice(0, count);
    this.waitingQueues.set(count, queue);

    const matchedUsers = await this.userRepository.findByIds(matchedUserIds);
    if (matchedUsers.length < count) return;

    const group = await this.matchGroupRepository.createGroup();
    await this.matchGroupMemberRepository.addMembers(group, matchedUsers);
    await this.matchRepository.markAsMatchedByUids(matchedUserIds);
  }

  getWaitingQueueStatus(): Record<number, number> {
    const status = {};
    for (const [count, queue] of this.waitingQueues.entries()) {
      status[count] = queue.length;
    }
    return status;
  }
}