import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Match } from './entity/match.entity';
import { MatchGroup } from './entity/matchGroup.entity';
import { MatchGroupMember } from './entity/matchGroupMember.entity';
import { MatchController } from './match.controller';
import { MatchScheduler } from './match.scheduler';
import { MatchService } from './match.service';
import { MatchRepository } from './repository/match.repository';
import { MatchGroupRepository } from './repository/matchGroup.repository';
import { MatchGroupMemberRepository } from './repository/matchGroupMember.repository';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Match, MatchGroup, MatchGroupMember, UserEntity]),
  ],
  exports: [MatchService],
  controllers: [MatchController],
  providers: [
    MatchService,
    MatchGroupRepository,
    MatchRepository,
    MatchGroupMemberRepository,
    MatchScheduler,
  ],
})
export class MatchModule {}
