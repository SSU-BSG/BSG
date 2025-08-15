import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserNotFoundException } from 'src/exception';
import {
  EditProfileRequest,
  EditProfileResponse,
  GetProfileResponse,
  RegisterRequest,
} from '../../src/user/dto/user.dto';
import { UserRepository } from '../../src/user/user.repository';
import { UserService } from '../../src/user/user.service';

type UserRepositoryMock = {
  create: jest.Mock;
  save: jest.Mock;
  findByUserId: jest.Mock;
  findOneById: jest.Mock;
};

const createUserRepositoryMock = (): UserRepositoryMock => ({
  create: jest.fn(),
  save: jest.fn(),
  findByUserId: jest.fn(),
  findOneById: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepositoryMock;

  beforeEach(async () => {
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mockAccessToken'),
    };

    userRepository = createUserRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  it('register() success', async () => {
    const dto: RegisterRequest = {
      userId: 'testuser',
      password: '1234',
      name: '홍길동',
      age: 22,
      studentYear: 3,
      major: '컴퓨터공학',
      gender: '남자',
    };

    const savedUser = { id: 1, ...dto };

    userRepository.findByUserId.mockResolvedValue(null);
    userRepository.create.mockReturnValue(savedUser);
    userRepository.save.mockResolvedValue(savedUser);

    const result = await userService.register(dto);

    expect(userRepository.findByUserId).toHaveBeenCalledWith(dto.userId);
    expect(userRepository.create).toHaveBeenCalledWith(dto);
    expect(userRepository.save).toHaveBeenCalledWith(savedUser);
    expect(result).toEqual({ message: '회원가입 성공' });
  });

  it('getProfile() success', async () => {
    const mockUser = {
      id: 1,
      userId: 'testuser',
      name: '홍길동',
      age: 22,
      studentYear: 3,
      major: '컴퓨터공학',
      gender: '남자',
    };

    userRepository.findOneById.mockResolvedValue(mockUser);

    const result: GetProfileResponse = await userService.getProfile(1);

    expect(userRepository.findOneById).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      userId: 'testuser',
      name: '홍길동',
      age: 22,
      studentYear: 3,
      major: '컴퓨터공학',
      gender: '남자',
    });
  });

  it('getProfile() failed', async () => {
    userRepository.findOneById.mockResolvedValue(null);

    await expect(userService.getProfile(99)).rejects.toThrow(
      UserNotFoundException,
    );
  });

  it('editProfie() success', async () => {
    const existingUser = {
      id: 1,
      userId: 'testuser',
      name: '기존이름',
      age: 20,
      studentYear: 1,
      major: '기존전공',
      gender: '여자',
    };

    const dto: EditProfileRequest = {
      name: '홍길동',
      age: 22,
      studentYear: 3,
      major: '컴퓨터공학',
      gender: '남자',
    };

    userRepository.findOneById.mockResolvedValue(existingUser);
    userRepository.save.mockResolvedValue({ ...existingUser, ...dto });

    const result: EditProfileResponse = await userService.editProfie(1, dto);

    expect(userRepository.findOneById).toHaveBeenCalledWith(1);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(dto),
    );
    expect(result).toEqual({ message: '회원정보 수정성공' });
  });

  it('editProfie() failed', async () => {
    userRepository.findOneById.mockResolvedValue(null);

    await expect(userService.editProfie(1, {})).rejects.toThrow(
      UserNotFoundException,
    );
  });
});
