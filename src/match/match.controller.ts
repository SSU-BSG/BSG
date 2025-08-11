import { Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';
import { AuthGuard } from 'src/user/auth/auth.guard';
import { CreateMatchRequest } from './dto/match.dto';
import { MatchService } from './match.service';
@Controller('/api')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}
  //createMatch
  @UseGuards(AuthGuard)
  @Post('/match/create')
  async createMatch(
    @Req() req: AuthenticatedRequest,
    createMatchRequest: CreateMatchRequest,
  ): Promise<string> {
    const userId: number = req.user.id;
    const result = await this.matchService.createMatch(
      userId,
      createMatchRequest,
    );

    return result;
  }
  //cancelMatch
  @UseGuards(AuthGuard)
  @Delete('/match/cancel')
  async cancelMatch(@Req() req: AuthenticatedRequest): Promise<string> {
    const userId: number = req.user.id;
    const result = await this.matchService.cancelMatch(userId);

    return result;
  }
  //connectMatch
}
