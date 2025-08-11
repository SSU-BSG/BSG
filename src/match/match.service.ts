import { Injectable } from '@nestjs/common';
import {
  CannotFoundMatchException,
  UserNotFoundException,
} from 'src/exception';
import { UserRepository } from './../user/user.repository';
import { CreateMatchRequest } from './dto/match.dto';
import { MatchStatus } from './entity/match.entity';
import { MatchRepository } from './repository/match.repository';
import { MatchGroupRepository } from './repository/matchGroup.repository';
import { MatchGroupMemberRepository } from './repository/matchGroupMember.repository';

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
    const result: string = '매칭 등록 완료';
    return result;
  }

  async cancelMatch(id: number): Promise<string> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new UserNotFoundException('유저정보가 존재하지 않습니다.');
    }

    const targetMatch = await this.matchRepository.findOneById(id);
    if (!targetMatch) {
      throw new CannotFoundMatchException('현재 대기중인 매칭이 없습니다.');
    }

    targetMatch.status = MatchStatus.CANCELED;
    await this.matchRepository.save(targetMatch);

    const result: string = '매칭 취소 완료';
    return result;
  }

  async connectMatch(count: number) {
    const waitingMatches = await this.matchRepository.findOldestWaiting(count);

    if (waitingMatches.length < count) return;

    const group = await this.matchGroupRepository.createGroup();

    await this.matchGroupMemberRepository.addMembers(
      group,
      waitingMatches.map((w) => w.user),
    );

    await this.matchRepository.saveAsMatched(waitingMatches);
  }
}
