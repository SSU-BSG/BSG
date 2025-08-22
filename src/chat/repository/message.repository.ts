import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Message } from './message.entity';
import { UserEntity } from 'src/user/user.entity';
import { MatchGroup } from 'src/match/entity/matchGroup.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(private dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }

  async createMessage(
    content: string,
    sender: UserEntity,
    matchGroup: MatchGroup,
  ): Promise<Message> {
    const message = this.create({ content, sender, matchGroup });
    await this.save(message);
    return message;
  }

  async findMessagesByMatchGroupId(matchGroupId: number): Promise<Message[]> {
    return this.find({
      where: { matchGroup: { id: matchGroupId } },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }
}
