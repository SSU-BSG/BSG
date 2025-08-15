import { IsNumber } from 'class-validator';

export class CreateMatchRequest {
  @IsNumber()
  wantedMatchCount: number;
}
