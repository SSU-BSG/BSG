import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository : Repository<UserEntity>,
    ) {}

    async rgister(userDTO : UserDTO.Register) {
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
}