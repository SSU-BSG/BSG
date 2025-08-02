import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/passport.jwt';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot({
      envFilePath: '.env.jwt',
      isGlobal: true, 
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule,],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    PassportModule
  ],
  exports:[UserService, UserRepository],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, UserRepository],
})

export class UserModule {}