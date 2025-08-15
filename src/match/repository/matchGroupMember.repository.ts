import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { MatchGroup } from '../entity/matchGroup.entity';
import { MatchGroupMember } from '../entity/matchGroupMember.entity';

@Injectable()
export class MatchGroupMemberRepository extends Repository<MatchGroupMember> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(MatchGroupMember, dataSource.createEntityManager());
  }

  async addMembers(group: MatchGroup, users: UserEntity[]): Promise<void> {
    const rows = users.map((u) => this.create({ group, user: u }));
    await this.save(rows);
  }
}
