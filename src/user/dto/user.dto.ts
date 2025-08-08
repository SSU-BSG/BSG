import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

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

export class RegisterResponse {
  @IsString()
  message: string;
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

export class EditProfileResponse {
  @IsString()
  message: string;
}

export class LoginResponse {
  @IsString()
  message: string;

  @IsString()
  accessToken: string;
}

export class GetProfileResponse {
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
