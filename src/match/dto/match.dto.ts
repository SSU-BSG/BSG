import { IsNumber } from 'class-validator';

export class createMatchRequest {
  @IsNumber()
  wantedMatchCount: number;
}
