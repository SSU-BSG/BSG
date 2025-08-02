import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository : Repository<UserEntity>,
    ) {}

    async register(userDTO : UserDTO.Register) {
        const userEntity = await this.userRepository.create(userDTO);
        console.log(userEntity); 
        return await this.userRepository.save(userEntity);
    }
    
    async findByUserId(userId : string) {
        return await this.userRepository.findOne({
            where: {
                userId,
            },
        });
    }

    async findById(id: number) {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        return user;
    }
}