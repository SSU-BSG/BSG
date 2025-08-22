import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserNotFoundException } from 'src/exception';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from '../user.entity';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: Payload): Promise<UserEntity> {
    const { id } = payload;
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new UserNotFoundException('존재하지 않는 회원입니다.');
    }

    return user;
  }
}

export interface Payload {
  id: number;
  userId: string;
  password: string;
  name: string;
  age: number;
  studentYear: number;
  major: string;
  gender: string;
  created_at: Date;
}
