import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { MatchGroup } from '../entity/matchGroup.entity';

@Injectable()
export class MatchGroupRepository extends Repository<MatchGroup> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(MatchGroup, dataSource.createEntityManager());
  }
}
