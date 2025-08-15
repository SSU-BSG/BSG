import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MatchFailedException } from 'src/exception';
import { MatchService } from './match.service';

@Injectable()
export class MatchScheduler {
  private readonly logger = new Logger(MatchScheduler.name);

  constructor(private readonly matchService: MatchService) {}

  @Cron('*/10 * * * * *')
  async connectMatch() {
    try {
      await this.matchService.connectAllMatches();
    } catch {
      throw new MatchFailedException('매칭 처리중 오류가 발생했습니다.');
    }
  }
}
