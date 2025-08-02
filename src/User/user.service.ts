import { Injectable, UnauthorizedException, ConflictException, NotFoundException} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from './dto/user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}

    async register(userDTO : UserDTO.RegisterRequest) {
        const userId : string = userDTO.userId;
        const hasUserId = await this.userRepository.findByUserId(userId);
        
        if (hasUserId) {
            throw new ConflictException('이미 사용중인 ID입니다.');
        }

        const userEntity = await this.userRepository.create(userDTO);
        console.log(userEntity); 
        return await this.userRepository.save(userEntity);
    }
    
    async login(userDTO: UserDTO.LogInRequest) {
        const userId : string = userDTO.userId;
        
        const user = await this.userRepository.findByUserId(userId);
        
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

        const result : UserDTO.LoginResponse = {
            message : '로그인 성공',
            accessToken : accessToken
        };

        return result;

    }

    async getProfile(id : number, ) {
        const user = await this.userRepository.findOneById(id);
        
        if (!user) {
            throw new NotFoundException('사용자를 찾을 수 없습니다.');
        }

        const result : UserDTO.ProfileResponse = {
            userId: user.userId,
            name: user.name,
            age: user.age,
            studentYear: user.studentYear,
            major: user.major,
            gender: user.gender,
        };

        return result;
    }

    async editProfie(id : number, userDTO : UserDTO.EditProfileRequest) {
        const user = await this.userRepository.findOneById(id);
        
        if (!user) {
            throw new UnauthorizedException('해당 유저에 대한 정보가 없습니다.');
        }

        if (userDTO.name !== undefined) user.name = userDTO.name;
        if (userDTO.age !== undefined) user.age = userDTO.age;
        if (userDTO.studentYear !== undefined) user.studentYear = userDTO.studentYear;
        if (userDTO.major !== undefined) user.major = userDTO.major;
        if (userDTO.gender !== undefined) user.gender = userDTO.gender;

        return await this.userRepository.save(user);

    }




}