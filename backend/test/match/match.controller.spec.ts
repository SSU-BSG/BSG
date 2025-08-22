import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedRequest } from '../../src/common/types/authenticated-request.interface';
import { CannotFoundMatchException } from '../../src/exception';
import { CreateMatchRequest } from '../../src/match/dto/match.dto';
import { MatchController } from '../../src/match/match.controller';
import { MatchService } from '../../src/match/match.service';

type MockedMatchService = jest.Mocked<MatchService>;

describe('MatchController', () => {
  let controller: MatchController;
  let matchService: MockedMatchService;

  const serviceMock: Partial<MockedMatchService> = {
    createMatch: jest.fn(),
    cancelMatch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [{ provide: MatchService, useValue: serviceMock }],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    matchService = module.get(MatchService);

    jest.clearAllMocks();
  });

  it('createMatch_success', async () => {
    const req = { user: { id: 10 } } as unknown as AuthenticatedRequest;
    const body: CreateMatchRequest = { wantedMatchCount: 3 };

    matchService.createMatch.mockResolvedValue('매칭 등록 완료');

    const res = await controller.createMatch(req, body);

    expect(res).toBe('매칭 등록 완료');
    expect(matchService.createMatch).toHaveBeenCalledWith(10, body);
  });

  it('cancelMatch_success', async () => {
    const req = { user: { id: 10 } } as unknown as AuthenticatedRequest;

    matchService.cancelMatch.mockResolvedValue('매칭 취소 완료');

    const res = await controller.cancelMatch(req);

    expect(res).toBe('매칭 취소 완료');
    expect(matchService.cancelMatch).toHaveBeenCalledWith(10);
  });

  it('cancelMatch_failed', async () => {
    const req = { user: { id: 10 } } as unknown as AuthenticatedRequest;

    matchService.cancelMatch.mockRejectedValue(
      new CannotFoundMatchException('현재 대기중인 매칭이 없습니다.'),
    );

    await expect(controller.cancelMatch(req)).rejects.toThrow(
      CannotFoundMatchException,
    );
    expect(matchService.cancelMatch).toHaveBeenCalledWith(10);
  });
});
