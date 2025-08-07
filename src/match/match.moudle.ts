import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchRepository } from './repository/match.repository';
import { MatchGroupRepository } from './repository/matchGroup.repository';

@Module({
  imports: [],
  exports: [MatchService],
  controllers: [],
  providers: [MatchService, MatchGroupRepository, MatchRepository],
})
export class MatchMoudle {}
