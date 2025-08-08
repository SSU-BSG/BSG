import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserNotFoundException } from 'src/excepttion/custom.exception';
import { UserEntity } from '../user.entity';
import { UserService } from '../user.service';
import { UserRepository } from './../user.repository';

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
    const { userId } = payload;
    const user = await this.userRepository.findByUserId(userId);
    if (!user) {
      throw new UserNotFoundException('존재하지 않는 회원입니다.');
    }

    return user;
  }
}

export interface Payload {
  userId: string;
}
