import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  @IsNotEmpty()
  matchGroupId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
