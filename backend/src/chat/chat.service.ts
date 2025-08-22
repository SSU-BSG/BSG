import { Injectable } from '@nestjs/common';
import { CannotFoundMatchException, UserNotFoundException } from 'src/exception';
import { MatchGroupRepository } from 'src/match/repository/matchGroup.repository';
import { UserRepository } from 'src/user/user.repository';
import { CreateMessageDto } from './dto/chat.dto';
import { MessageRepository } from './repository/message.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    private readonly matchGroupRepository: MatchGroupRepository,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto, senderId: number) {
    const sender = await this.userRepository.findOneById(senderId);
    if (!sender) {
      throw new UserNotFoundException('유저정보가 존재하지 않습니다.');
    }

    const matchGroup = await this.matchGroupRepository.findOneById(
      createMessageDto.matchGroupId,
    );
    if (!matchGroup) {
      throw new CannotFoundMatchException('매치 그룹이 존재하지 않습니다.');
    }

    return this.messageRepository.createMessage(
      createMessageDto.content,
      sender,
      matchGroup,
    );
  }

  async getMessages(matchGroupId: number) {
    return this.messageRepository.findMessagesByMatchGroupId(matchGroupId);
  }
}
