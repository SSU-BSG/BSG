import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MatchGroupMember } from '../entity/matchGroupMember.entity';

@Injectable()
export class MatchGroupMemberRepository extends Repository<MatchGroupMember> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(MatchGroupMember, dataSource.createEntityManager());
  }
}
