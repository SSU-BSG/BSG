import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/user/user.entity';
import { LoginRequest, RegisterRequest } from '../../src/user/dto/user.dto';
import { UserController } from '../../src/user/user.controller';
import { UserService } from '../../src/user/user.service';

describe('userController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserService: Partial<jest.Mocked<UserService>> = {
    register: jest.fn(),
    login: jest.fn(),
    editProfie: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  const userDTO: RegisterRequest = {
    userId: 'testuser',
    password: '1234',
    name: '홍길동',
    age: 22,
    studentYear: 3,
    major: '컴퓨터공학',
    gender: '남자',
  };

  // 회원가입 실패
  it('register_failed', async () => {
    userService.register.mockRejectedValue(
      new ConflictException('이미 사용중인 ID입니다.'),
    );

    await expect(controller.register(userDTO)).rejects.toThrow(
      ConflictException,
    );
    expect(userService.register).toHaveBeenCalledWith(userDTO);
  });

  // 회원가입 성공
  it('register_success', async () => {
    userService.register.mockResolvedValue({
      id: 1,
      ...userDTO,
    } as unknown as UserEntity);

    const result = await controller.register(userDTO);

    expect(result).toBe('회원가입 성공');
    expect(userService.register).toHaveBeenCalledWith(userDTO);
  });

  //로그인 성공
  it('login_success', async () => {
    const loginDTO: LoginRequest = {
      userId: 'testuser',
      password: '1234',
    };

    userService.login.mockResolvedValue({
      message: '로그인 성공',
      accessToken: 'mockAccessToken',
    });

    const result = await controller.login(loginDTO);

    expect(result).toEqual({
      message: '로그인 성공',
      accessToken: 'mockAccessToken',
    });
    expect(userService.login).toHaveBeenCalledWith(loginDTO);
  });
});
