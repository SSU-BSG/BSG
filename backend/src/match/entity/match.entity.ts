import { UserEntity } from 'src/user/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

export enum MatchStatus {
  WAITING = 'WAITING',
  MATCHED = 'MATCHED',
  CANCELED = 'CANCELED',
}

@Entity('match')
export class Match extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: 'enum', enum: MatchStatus, default: MatchStatus.WAITING })
  status: MatchStatus;

  @Column()
  wantedMatchCount: number;

  @CreateDateColumn()
  created: Date;
}
