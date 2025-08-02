import {Body, Controller, Post, UseGuards, Get, Req, Param, Put, Patch} from '@nestjs/common'
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from './auth/auth.guard';

@Controller('user')
export class UserController {
     constructor(private readonly userService: UserService) {}

    @Post('/register')
    async register(@Body() userDTO: UserDTO.RegisterRequest) {
        await this.userService.register(userDTO);
        return '회원가입 성공';
    }

    @Post('/login')
    async login(@Body() userDTO: UserDTO.LogInRequest) {
        const result = await this.userService.login(userDTO);

        return result;
    }

    @UseGuards(AuthGuard)
    @Get('/my-profile')
    async getProfile(@Req() req : any): Promise<UserDTO.ProfileResponse> {
        const id = req.id;
        const result = await this.userService.getProfile(id);

        return result;
    }

    @UseGuards(AuthGuard)
    @Patch('/me/edit-profile')
    async editProfile(@Req() req : any, @Body() UserDTO : UserDTO.EditProfileRequest ) {
        const id = req.user.id;
        await this.userService.editProfie(id, UserDTO);

        return '회원정보 수정성공';

    }
}
