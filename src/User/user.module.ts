import { Module, Controller } from '@nestjs/common';
import { userController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity])],
  exports:[UserService],
  controllers: [userController],
  providers: [UserService],
})

export class UserModule {}