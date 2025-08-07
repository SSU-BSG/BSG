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
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RegisterRequest,
} from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() userDTO: RegisterRequest) {
    await this.userService.register(userDTO);
    return '회원가입 성공';
  }

  @Post('/login')
  async login(@Body() userDTO: LoginRequest) {
    const result: LoginResponse = await this.userService.login(userDTO);

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('/my-profile')
  async getProfile(@Req() req: AuthenticatedRequest): Promise<ProfileResponse> {
    const id = req.user.id;
    const result: ProfileResponse = await this.userService.getProfile(id);

    return result;
  }

  @UseGuards(AuthGuard)
  @Patch('/me/edit-profile')
  async editProfile(
    @Req() req: AuthenticatedRequest,
    @Body() UserDTO: EditProfileRequest,
  ) {
    const id = req.user.id;
    await this.userService.editProfie(id, UserDTO);

    return '회원정보 수정성공';
  }
}
