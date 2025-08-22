import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest } from 'backend/src/common/types/authenticated-request.interface';
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
    userService.register.mockResolvedValue({ message: '회원가입 성공' });

    const result = await controller.register(userDTO);
    expect(result).toEqual({ message: '회원가입 성공' });
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

  // 프로필 조회 성공
  it('getProfile_success', async () => {
    const mockUserId = 1;
    const mockReq = { user: { id: mockUserId } } as AuthenticatedRequest;

    const profileResponse = {
      id: mockUserId,
      userId: 'testuser',
      name: '홍길동',
      age: 22,
      studentYear: 3,
      major: '컴퓨터공학',
      gender: '남자',
    };

    userService.getProfile.mockResolvedValue(profileResponse);

    const result = await controller.getProfile(mockReq);

    expect(result).toEqual(profileResponse);
    expect(userService.getProfile).toHaveBeenCalledWith(mockUserId);
  });

  // 프로필 수정 성공
  it('editProfile_success', async () => {
    const mockUserId = 1;
    const mockReq = { user: { id: mockUserId } } as AuthenticatedRequest;

    const editDTO = {
      name: '홍길동2',
      age: 23,
      studentYear: 4,
      major: '소프트웨어',
      gender: '여자',
    };

    const expectedResponse = {
      message: '프로필 수정 성공',
    };

    userService.editProfie.mockResolvedValue(expectedResponse);

    const result = await controller.editProfile(mockReq, editDTO);

    expect(result).toEqual(expectedResponse);
    expect(userService.editProfie).toHaveBeenCalledWith(mockUserId, editDTO);
  });
});
