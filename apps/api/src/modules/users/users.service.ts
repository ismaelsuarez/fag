import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UserEntity) private readonly users: Repository<UserEntity>) {}

  list() {
    return this.users.find({ take: 50 });
  }
}


