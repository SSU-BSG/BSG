import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchGroup } from 'src/match/entity/matchGroup.entity';
import { MatchGroupRepository } from 'src/match/repository/matchGroup.repository';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './entity/message.entity';
import { MessageRepository } from './repository/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Message, MatchGroup]), UserModule],
  providers: [
    ChatGateway,
    ChatService,
    MessageRepository,
    MatchGroupRepository,
  ],
})
export class ChatModule {}
