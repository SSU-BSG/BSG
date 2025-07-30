import { Module } from '@nestjs/common';
import { userController } from '../controller/user.controller';
import { UserSeervice } from '../service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from '../domain/user';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity])],
  exports:[UserSeervice],
  controllers: [userController],
  providers: [UserSeervice],
})

export class UserModule {}