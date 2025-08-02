import {Body, ConflictException, UnauthorizedException, Controller, Post, UseGuards, Get, Req, Param, NotFoundException} from '@nestjs/common'
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';


@Controller('user')
export class UserController {
     constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    @Post('/register')
    async register(@Body() userDTO: UserDTO.Register) {
        
        const userId : string = userDTO.userId;

        const hasUserId = await this.userService.findByUserId(userId);

        if (hasUserId) {
            throw new ConflictException('이미 사용중인 ID입니다.');
        }

        const user_entity = await this.userService.register(userDTO);

        return '회원가입 성공';
    }

    @Post('/login')
    async login(@Body() userDTO: UserDTO.LogIn) {
        const userId : string = userDTO.userId;

        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new UnauthorizedException('아이디를 확인해주세요.');
        }

        const isMatch : boolean = bcrypt.compareSync(userDTO.password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('비밀번호를 확인해주세요.');
        }
        
        const payload = {
            id : user.id,
        }

        const accessToken = this.jwtService.sign(payload);

        return {
            message: '로그인 성공',
            accessToken: accessToken,
        };
    }

    @UseGuards(AuthGuard)
    @Get('/me')
    async getProfile(@Req() req : any): Promise<UserDTO.ProfileResponse> {
        const user = await this.userService.findById(req.user.id);
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        return {
            id: user.id,
            userId: user.userId,
            name: user.name,
            age: user.age,
            studentYear: user.studentYear,
            major: user.major,
            gender: user.gender,
            created_at: user.created_at,
        };
    }
}
