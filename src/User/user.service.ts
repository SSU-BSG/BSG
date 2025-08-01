import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userEntity } from 'src/user/user.entity';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(userEntity)
        private userRepository : Repository<userEntity>,
    ) {}

    async rgister(userDTO : UserDTO.register) {
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