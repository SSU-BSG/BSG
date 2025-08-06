import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<UserEntity | null> {
    return this.findOneBy({ userId });
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return this.findOneBy({ id });
  }
}
