import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from 'src/exception';
import { UserRepository } from './../user/user.repository';
import { CreateMatchRequest } from './dto/match.dto';
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

  //createMatch
  async createMatch(userId: number, createMatchRequest: CreateMatchRequest) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new UserNotFoundException('올바르지 않은 유저정보입니다.');
    }

    const match = this.matchRepository.create({
      user,
      wantedMatchCount: createMatchRequest.wantedMatchCount,
      isWaiting: true,
    });

    await this.matchRepository.save(match);
  }
  //cancelMatch
  //connectMatch
}
