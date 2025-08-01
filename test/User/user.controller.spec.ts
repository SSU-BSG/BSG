    import { Test, TestingModule } from '@nestjs/testing';
    import { userController } from '../../src/user/user.controller';
    import { UserService } from '../../src/user/user.service';
    import { ConflictException } from '@nestjs/common';
    import { UserDTO } from '../../src/user/dto/user.dto';
    import { userEntity } from 'src/user/user.entity';

    describe('userController', () => {
        let controller: userController;
        let userService: jest.Mocked<UserService>;

        const mockUserService = {
            findByUserId: jest.fn(),
            rgister: jest.fn(),
        };

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
            controllers: [userController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
            }).compile();

            controller = module.get<userController>(userController);
            userService = module.get(UserService);
        });

        it('should throw ConflictException if userId already exists', async () => {
            const dto: UserDTO.register = {
                userId: 'testuser',
                password: '1234',
                name: '홍길동',
                age: 22,
                studentYear: 3,
                major: '컴퓨터공학',
                gender: '남자',
            };

            userService.findByUserId.mockResolvedValue({ ...dto } as unknown as userEntity);

            await expect(controller.register(dto)).rejects.toThrow(ConflictException);
            expect(userService.findByUserId).toHaveBeenCalledWith(dto.userId);
        });
        
        it('should return success message when registration succeeds', async () => {
            const dto: UserDTO.register = {
                userId: 'newuser',
                password: 'abcd1234',
                name: '이순신',
                age: 25,
                studentYear: 2,
                major: '수학과',
                gender: '남자',
            };

            userService.findByUserId.mockResolvedValue(null);
            userService.rgister.mockResolvedValue({ id: 1, ...dto } as unknown as userEntity);

            const result = await controller.register(dto);
            expect(result).toBe('회원가입 성공');
            expect(userService.findByUserId).toHaveBeenCalledWith(dto.userId);
            expect(userService.rgister).toHaveBeenCalledWith(dto);
        }); 
    });