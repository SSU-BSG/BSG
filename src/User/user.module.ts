import { Module } from '@nestjs/common';
import { userController } from '../controller/user.controller';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity])],
  exports:[UserService],
  controllers: [userController],
  providers: [UserService],
})

export class UserModule {}