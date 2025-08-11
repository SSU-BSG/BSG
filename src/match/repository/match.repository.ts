import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Match, MatchStatus } from '../entity/match.entity';

@Injectable()
export class MatchRepository extends Repository<Match> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Match, dataSource.createEntityManager());
  }

  async findOneById(userPk: number): Promise<Match | null> {
    return this.findOne({
      where: {
        user: { id: userPk },
        status: MatchStatus.WAITING,
      },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async findOldestWaiting(count: number): Promise<Match[]> {
    return this.find({
      where: { status: MatchStatus.WAITING, wantedMatchCount: count },
      order: { created: 'ASC' },
      take: count,
      lock: { mode: 'pessimistic_write' },
      relations: ['user'],
    });
  }

  async saveAsMatched(matches: Match[]): Promise<void> {
    for (const match of matches) {
      match.status = MatchStatus.MATCHED;
      await this.save(match);
    }
  }
}
