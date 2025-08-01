    import { Test, TestingModule } from '@nestjs/testing';
    import { UserController } from '../../src/user/user.controller';
    import { UserService } from '../../src/user/user.service';
    import { ConflictException } from '@nestjs/common';
    import { UserDTO } from '../../src/user/dto/user.dto';
    import { UserEntity } from 'src/user/user.entity';
    import { JwtService } from '@nestjs/jwt';
    import * as bcrypt from 'bcrypt';

    describe('userController', () => {
        let controller: UserController;
        let userService: jest.Mocked<UserService>;

        const mockUserService = {
            findByUserId: jest.fn(),
            rgister: jest.fn(),
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
        
        const userDTO : UserDTO.Register = {
            userId: 'testuser',
            password: '1234',
            name: '홍길동',
            age: 22,
            studentYear: 3,
            major: '컴퓨터공학',
            gender: '남자',
        };

        const hashedPassword = bcrypt.hashSync('1234', 10);

        const mockUser = {
            id: 1,
            userId: 'testuser',
            password: hashedPassword,
            name: '홍길동',
            age: 22,
            studentYear: 3,
            major: '컴퓨터공학',
            gender: '남자',
            created_at: new Date('2025-01-01T00:00:00Z'),
            deleted_at: null,
        } as unknown as UserEntity;
        
        // 회원가입 실패
        it('register_failed', async () => {
            
            userService.findByUserId.mockResolvedValue({ ...userDTO } as unknown as UserEntity);

            await expect(controller.register(userDTO)).rejects.toThrow(ConflictException);
            expect(userService.findByUserId).toHaveBeenCalledWith(userDTO.userId);

        });
        
        // 회원가입 성공
        it('register_success', async () => {
            userService.findByUserId.mockResolvedValue(null);
            userService.rgister.mockResolvedValue({ id: 1, ...userDTO } as unknown as UserEntity);

            const result = await controller.register(userDTO);
            expect(result).toBe('회원가입 성공');
            expect(userService.findByUserId).toHaveBeenCalledWith(userDTO.userId);
            expect(userService.rgister).toHaveBeenCalledWith(userDTO);
        }); 
    
        //로그인 성공
        it('login_success', async () => {
            const loginDTO : UserDTO.LogIn = {
                userId : 'testuser',
                password : '1234',
            };
            
            userService.findByUserId.mockResolvedValue(mockUser);
            const result = await controller.login(loginDTO);

            expect(result).toEqual({
                message: '로그인 성공',
                accessToken: 'mockAccessToken'});
        })
        
        //로그인 실패
        it('login_failed', async() => {
            const loginDTO : UserDTO.LogIn = {
                userId : 'testuser',
                password : '12345',
            };
            
            userService.findByUserId.mockResolvedValue(mockUser);
            
            await expect(controller.login(loginDTO)).rejects.toThrow('비밀번호를 확인해주세요.');
        })

        //로그인 실패
        it('login_failed', async() => {
            const loginDTO : UserDTO.LogIn = {
                userId : 'unknown_user',
                password : '1234',
            };
            
            userService.findByUserId.mockResolvedValue(null);
            
            await expect(controller.login(loginDTO)).rejects.toThrow('아이디를 확인해주세요.');
        })
    });