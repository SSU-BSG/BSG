import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchService } from './match.service';

@Injectable()
export class MatchScheduler {
  private readonly logger = new Logger(MatchScheduler.name);

  constructor(private readonly matchService: MatchService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async logWaitingQueueStatus() {
    this.logger.log('현재 매칭 대기열 상태를 확인합니다...');
    try {
      const queueStatus = this.matchService.getWaitingQueueStatus();
      this.logger.log(`현재 대기열: ${JSON.stringify(queueStatus)}`);
    } catch (error) {
      this.logger.error('대기열 상태 확인 중 오류 발생', error.stack);
    }
  }
}