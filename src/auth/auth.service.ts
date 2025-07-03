import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(pass, user.password);
    if (!match) throw new UnauthorizedException('Incorrect login or password');

    return user;
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: Omit<User, 'password' | 'role'>; accessToken: string }> {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    const { password, role, ...cleanUser } = user;

    return {
      user: cleanUser,
      accessToken: token,
    };
  }

  async register(
    dto: RegisterDto,
  ): Promise<{ user: Omit<User, 'password' | 'role'>; accessToken: string }> {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const createdUser = await this.usersService.createUser({
      fullName: dto.fullName,
      email: dto.email,
      password: hashed,
      avatarUrl: dto.avatarUrl ?? null,
    });

    const payload = {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    };
    const token = this.jwtService.sign(payload);

    const { password, role, ...cleanUser } = createdUser;

    return {
      user: cleanUser,
      accessToken: token,
    };
  }
}
