import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Match } from '../entity/match.entity';

@Injectable()
<<<<<<< HEAD
export class MatchRepository extends Repository<Match> {
=======
export class UserRepository extends Repository<Match> {
>>>>>>> origin/feature/14
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Match, dataSource.createEntityManager());
  }
}
