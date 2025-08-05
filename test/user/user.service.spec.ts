import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/user.service';
import { UserDTO } from '../../src/user/dto/user.dto';
import { UserRepository } from '../../src/user/user.repository';
import { JwtService } from '@nestjs/jwt';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findByUserId: jest.fn(),
  findOneById: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository;
  const mockedRepository = mockUserRepository();

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mockAccessToken'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockedRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = mockedRepository;
  });

  // register test코드
  it('register() should create and save a user', async () => {
    const dto: UserDTO.RegisterRequest = {
      userId: 'testuser',
      password: '1234',
      name: '홍길동',
      age: 22,
      studentYear: 3,
      major: '컴퓨터공학',
      gender: '남자',
    };

    const savedUser = { id: 1, ...dto };

    userRepository.findByUserId!.mockResolvedValue(null);
    userRepository.create!.mockReturnValue(savedUser);
    userRepository.save!.mockResolvedValue(savedUser);

    const result = await userService.register(dto);

    expect(userRepository.findByUserId).toHaveBeenCalledWith(dto.userId);
    expect(userRepository.create).toHaveBeenCalledWith(dto);
    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual(savedUser);
  });
});
