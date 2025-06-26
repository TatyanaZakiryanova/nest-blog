import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private removeSensitiveFields(user: User): Omit<User, 'password' | 'role'> {
    const { password, role, ...clean } = user;
    return clean;
  }

  async findAll(): Promise<Omit<User, 'password' | 'role'>[]> {
    const users = await this.usersRepository.find();
    return users.map(this.removeSensitiveFields);
  }

  async findOne(id: number): Promise<Omit<User, 'password' | 'role'>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.removeSensitiveFields(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    const saved = await this.usersRepository.save(user);
    return saved;
  }
}
