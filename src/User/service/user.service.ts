import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userEntity } from 'src/User/domain/user';
import { UserDTO } from '../dto/user.dto';

@Injectable()
export class UserSeervice {
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