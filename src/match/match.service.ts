import { Injectable } from '@nestjs/common';
import { UserRepository } from './../user/user.repository';
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
  /*
  @Entity('match')
  export class Match extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => UserEntity)
    user: UserEntity;
  
    @Column({ default: true })
    isWaiting: boolean;
  
    @Column()
    wantedMatchCount: number;
  
    @CreateDateColumn()
    created: Date;
  }
  */
  //cancelMatch
  //connectMatch
}
