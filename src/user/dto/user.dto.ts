import { IsString, Length, IsNumber, IsOptional } from 'class-validator';

export class RegisterRequest {
  @IsString()
  userId: string;

  @IsString()
  @Length(4, 20)
  password: string;

  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsNumber()
  studentYear: number;

  @IsString()
  major: string;

  @IsString()
  gender: string;
}

export class LoginRequest {
  @IsString()
  userId: string;

  @IsString()
  @Length(4, 20)
  password: string;
}

export class EditProfileRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  studentYear?: number;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  gender?: string;
}

export class LoginResponse {
  @IsString()
  message: string;

  @IsString()
  accessToken: string;
}

export class ProfileResponse {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  age: number;

  @IsString()
  studentYear: number;

  @IsString()
  major: string;

  @IsString()
  gender: string;
}
