import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  InvalidPasswordException,
  InvalidUserIdException,
  UserIdConflictException,
  UserNotFoundException,
} from 'src/excepttion/custom.exception';
import {
  EditProfileRequest,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RegisterRequest,
} from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDTO: RegisterRequest) {
    const userId: string = userDTO.userId;
    const hasUserId = await this.userRepository.findByUserId(userId);

    if (hasUserId) {
      throw new UserIdConflictException('이미 사용중인 ID입니다.');
    }

    const userEntity = this.userRepository.create(userDTO);
    console.log(userEntity);
    return await this.userRepository.save(userEntity);
  }

  async login(userDTO: LoginRequest) {
    const userId: string = userDTO.userId;

    const user = await this.userRepository.findByUserId(userId);

    if (!user) {
      throw new InvalidUserIdException('아이디를 확인해주세요.');
    }

    const isMatch: boolean = bcrypt.compareSync(
      userDTO.password,
      user.password,
    );

    if (!isMatch) {
      throw new InvalidPasswordException('비밀번호를 확인해주세요.');
    }
    const payload = {
      id: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    const result: LoginResponse = {
      message: '로그인 성공',
      accessToken: accessToken,
    };

    return result;
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new UserNotFoundException('사용자를 찾을 수 없습니다.');
    }

    const result: ProfileResponse = {
      userId: user.userId,
      name: user.name,
      age: user.age,
      studentYear: user.studentYear,
      major: user.major,
      gender: user.gender,
    };

    return result;
  }

  async editProfie(id: number, userDTO: EditProfileRequest) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new UserNotFoundException('해당 유저에 대한 정보가 없습니다.');
    }

    if (userDTO.name !== undefined) user.name = userDTO.name;
    if (userDTO.age !== undefined) user.age = userDTO.age;
    if (userDTO.studentYear !== undefined)
      user.studentYear = userDTO.studentYear;
    if (userDTO.major !== undefined) user.major = userDTO.major;
    if (userDTO.gender !== undefined) user.gender = userDTO.gender;

    return await this.userRepository.save(user);
  }
}
