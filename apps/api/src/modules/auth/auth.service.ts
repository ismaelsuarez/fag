import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserEntity) private readonly users: Repository<UserEntity>) {}

  async login(email: string, _password: string) {
    const user = await this.users.findOne({ where: { email } });
    return { token: 'mock-token', user: user ? { id: user.id, email: user.email } : null };
  }

  async register(email: string, _password: string) {
    const exists = await this.users.findOne({ where: { email } });
    if (exists) return { ok: true };
    const created = this.users.create({ email, passwordHash: 'hash', role: 'customer' });
    await this.users.save(created);
    return { ok: true };
  }
}


