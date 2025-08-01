import { Module, Controller } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { userController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([userEntity]),
    ConfigModule.forRoot({
      envFilePath: '.env.jwt',
      isGlobal: true, 
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  exports:[UserService],
  controllers: [userController],
  providers: [UserService],
})

export class UserModule {}