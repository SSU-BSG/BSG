import {Body, ConflictException, UnauthorizedException, Controller, Post} from '@nestjs/common'
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class userController {
     constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    @Post('/register')
    async register(@Body() userDTO: UserDTO.Register) {
        
        const userId : string = userDTO.userId;

        const hasUserId = await this.userService.findByUserId(userId);

        if (hasUserId) {
            throw new ConflictException('이미 사용중인 ID입니다.');
        }

        const user_entity = await this.userService.rgister(userDTO);

        return '회원가입 성공';
    }

    @Post('/login')
    async login(@Body() userDTO: UserDTO.LogIn) {
        const userId : string = userDTO.userId;

        const user = await this.userService.findByUserId(userId);

        if (!user) {
            throw new UnauthorizedException('아이디를 확인해주세요.');
        }

        const isMatch : boolean = bcrypt.compareSync(user.password, userDTO.password);

        if (!isMatch) {
            throw new UnauthorizedException('비밀번호를 확인해주세요.');
        }
        
        const payload = {
            id : user.id,
        }

        const accessTocken = this.jwtService.sign(payload);
        
        return '로그인 성공';
    }
}