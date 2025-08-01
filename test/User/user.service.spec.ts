import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntity } from '../../src/user/user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from '../../src/user/dto/user.dto';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

describe('UserService', () => {
    let userService : UserService;
    let userRepository: jest.Mocked<ReturnType<typeof mockUserRepository>>;

    beforeEach( async () => {
        const module : TestingModule = await Test.createTestingModule({
            providers : [
                UserService,
                {
                    provide : getRepositoryToken(userEntity),
                    useFactory : mockUserRepository,
                }
            ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(userEntity));
    });
    
    // register test코드
    it('register() should create and save a user', async () => {
        const dto: UserDTO.register = {
        userId: 'testuser',
        password: '1234',
        name: '홍길동',
        age: 22,
        studentYear: 3,
        major: '컴퓨터공학',
        gender: '남자',
    };

    const savedUser = { id: 1, ...dto };
    userRepository.create!.mockReturnValue(savedUser);
    userRepository.save!.mockResolvedValue(savedUser);

    const result = await userService.rgister(dto);
    expect(userRepository.create).toHaveBeenCalledWith(dto);
    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });

});

