import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Match } from '../entity/match.entity';

@Injectable()
export class MatchRepository extends Repository<Match> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Match, dataSource.createEntityManager());
  }
}
