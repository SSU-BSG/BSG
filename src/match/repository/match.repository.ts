import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Match, MatchStatus } from '../entity/match.entity';

@Injectable()
export class MatchRepository extends Repository<Match> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Match, dataSource.createEntityManager());
  }

  async findWaitingByUserId(userId: number): Promise<Match | null> {
    return this.createQueryBuilder('m')
      .setLock('pessimistic_write')
      .leftJoin('m.user', 'u')
      .where('u.id = :uid', { uid: userId })
      .andWhere('m.status = :st', { st: MatchStatus.WAITING })
      .getOne();
  }

  async findOldestWaiting(count: number): Promise<Match[]> {
    return this.createQueryBuilder('m')
      .setLock('pessimistic_write')
      .leftJoinAndSelect('m.user', 'u')
      .where('m.status = :st', { st: MatchStatus.WAITING })
      .andWhere('m.wantedMatchCount = :cnt', { cnt: count })
      .orderBy('m.created', 'ASC')
      .take(count)
      .getMany();
  }

  async markAsMatched(matchIds: number[]): Promise<void> {
    await this.createQueryBuilder()
      .update(Match)
      .set({ status: MatchStatus.MATCHED })
      .whereInIds(matchIds)
      .execute();
  }

  async findDistinctWaitingCounts(): Promise<number[]> {
    const rows = await this.createQueryBuilder('m')
      .select('DISTINCT m.wantedMatchCount', 'wantedMatchCount')
      .where('m.status = :st', { st: MatchStatus.WAITING })
      .orderBy('wantedMatchCount', 'ASC')
      .getRawMany<{ wantedMatchCount: number }>();

    return rows.map((r) => r.wantedMatchCount);
  }
}
