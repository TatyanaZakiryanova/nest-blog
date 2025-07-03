import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from 'src/auth/dto/register.dto';

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
    return users.map((user) => this.removeSensitiveFields(user));
  }

  async findOne(id: number): Promise<Omit<User, 'password' | 'role'>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.removeSensitiveFields(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(dto: RegisterDto): Promise<User> {
    const user = this.usersRepository.create(dto);
    const saved = await this.usersRepository.save(user);
    return saved;
  }
}
