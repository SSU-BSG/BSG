import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MatchGroupMember } from './matchGroupMember.entity';

@Entity('match_group')
export class MatchGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MatchGroupMember, (member) => member.group, {
    cascade: true,
  })
  members: MatchGroupMember[];

  @CreateDateColumn()
  createdAt: Date;
}
