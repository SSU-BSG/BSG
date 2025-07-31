import {Body, ConflictException, Controller, Post} from '@nestjs/common'
import { UserDTO } from '../dto/user.dto';
import { UserService } from '../service/user.service';

@Controller('user')
export class userController {
     constructor(private readonly userService: UserService) {}

    @Post('/register')
    async register(@Body() userDTO: UserDTO.register) {
        
        const userId : string = userDTO.userId;

        const hasUserId = await this.userService.findByUserId(userId);

        if (hasUserId) {
            throw new ConflictException('이미 사용중인 ID입니다.');
        }

        const user_entity = await this.userService.rgister(userDTO);

        return '회원가입 성공';
    }
}