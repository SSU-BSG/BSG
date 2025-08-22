import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UserRepository } from '../user/user.repository';
import { CreateMatchRequest } from './dto/match.dto';
import { MatchStatus } from './entity/match.entity';
import { MatchRepository } from './repository/match.repository';
import { MatchGroupRepository } from './repository/matchGroup.repository';
import { MatchGroupMemberRepository } from './repository/matchGroupMember.repository';
import {
  CannotFoundMatchException,
  UserNotFoundException,
} from '../exception';

@Injectable()
export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchGroupRepository: MatchGroupRepository,
    private readonly matchGroupMemberRepository: MatchGroupMemberRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createMatch(
    id: number,
    createMatchRequest: CreateMatchRequest,
  ): Promise<string> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new UserNotFoundException('유저정보가 존재하지 않습니다.');
    }

    const match = this.matchRepository.create({
      user,
      wantedMatchCount: createMatchRequest.wantedMatchCount,
      status: MatchStatus.WAITING,
    });

    await this.matchRepository.save(match);
    return '매칭 등록 완료';
  }

  async cancelMatch(id: number): Promise<string> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new UserNotFoundException('유저정보가 존재하지 않습니다.');
    }

    const targetMatch = await this.matchRepository.findWaitingByUserId(id);
    if (!targetMatch) {
      throw new CannotFoundMatchException('현재 대기중인 매칭이 없습니다.');
    }

    targetMatch.status = MatchStatus.CANCELED;
    await this.matchRepository.save(targetMatch);

    return '매칭 취소 완료';
  }

  @Transactional()
  async connectMatch(count: number): Promise<void> {
    const waiting = await this.matchRepository.findOldestWaiting(count);
    if (waiting.length < count) return;

    const group = await this.matchGroupRepository.createGroup();

    await this.matchGroupMemberRepository.addMembers(
      group,
      waiting.map((w) => w.user),
    );

    await this.matchRepository.markAsMatched(waiting.map((w) => w.id));
  }

  async connectAllMatches(): Promise<void> {
    const counts = await this.matchRepository.findDistinctWaitingCounts();
    for (const k of counts) {
      await this.connectMatch(k);
    }
  }
}
