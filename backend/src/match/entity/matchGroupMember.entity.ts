import { UserEntity } from 'src/user/user.entity';
import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchGroup } from './matchGroup.entity';

@Entity('match_group_member')
export class MatchGroupMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => MatchGroup, (group) => group.members)
  group: MatchGroup;

  @CreateDateColumn()
  created: Date;
}
