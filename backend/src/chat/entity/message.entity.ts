import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { MatchGroup } from '../../match/entity/matchGroup.entity';

@Entity('message')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity)
  sender: UserEntity;

  @ManyToOne(() => MatchGroup)
  matchGroup: MatchGroup;

  @CreateDateColumn()
  createdAt: Date;
}
