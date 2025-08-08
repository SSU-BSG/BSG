import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';
import { AuthGuard } from './auth/auth.guard';
import {
  EditProfileRequest,
  EditProfileResponse,
  GetProfileResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from './dto/user.dto';
import { UserService } from './user.service';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/auth/sign-up')
  async register(@Body() userDTO: RegisterRequest): Promise<RegisterResponse> {
    const result: RegisterResponse = await this.userService.register(userDTO);
    return result;
  }

  @Post('/auth/sign-in')
  async login(@Body() userDTO: LoginRequest): Promise<LoginResponse> {
    const result: LoginResponse = await this.userService.login(userDTO);

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('/users/me')
  async getProfile(
    @Req() req: AuthenticatedRequest,
  ): Promise<GetProfileResponse> {
    const id = req.user.id;
    const result: GetProfileResponse = await this.userService.getProfile(id);

    return result;
  }

  @UseGuards(AuthGuard)
  @Patch('/users/me')
  async editProfile(
    @Req() req: AuthenticatedRequest,
    @Body() UserDTO: EditProfileRequest,
  ): Promise<EditProfileResponse> {
    const id = req.user.id;
    const result: EditProfileResponse = await this.userService.editProfie(
      id,
      UserDTO,
    );

    return result;
  }
}
