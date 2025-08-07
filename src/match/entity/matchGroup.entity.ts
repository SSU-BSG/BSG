import { UserEntity } from 'src/user/user.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('matchGroup')
export class MatchGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinTable()
  user: UserEntity[];

  @CreateDateColumn()
  created: Date;
}
