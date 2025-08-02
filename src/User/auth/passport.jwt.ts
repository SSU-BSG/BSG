import { UserRepository } from './../user.repository';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { UserService } from '../user.service';
import { UserEntity } from "../user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService : UserService, private userRepository : UserRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : process.env.JWT_SECRET,
        })
    }

    async validate(payload : Payload) : Promise<UserEntity>  {
        const { userId } = payload;
        const user = await this.userRepository.findByUserId(userId);
        if (!user) {
            throw new UnauthorizedException({ message : '존재하지 않는 회원입니다.' });
        }

        return user;
    }

}

export interface Payload {
  userId: string;
}
