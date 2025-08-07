import { Module } from '@nestjs/common';
import { MatchService } from './match.service';

@Module({
  imports: [],
  exports: [MatchService],
  controllers: [],
  providers: [MatchService],
})
export class MatchMoudle {}
