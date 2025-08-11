import { IsNumber } from 'class-validator';

<<<<<<< HEAD
export class CreateMatchRequest {
=======
export class createMatchRequest {
>>>>>>> origin/feature/14
  @IsNumber()
  wantedMatchCount: number;
}
