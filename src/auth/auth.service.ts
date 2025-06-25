import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private buildAuthResponse(user: User) {
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);
    const { password, ...cleanUser } = user;

    return {
      user: cleanUser,
      accessToken: token,
    };
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(pass, user.password);
    if (!match) throw new UnauthorizedException('Incorrect login or password');

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    return this.buildAuthResponse(user);
  }

  async register(dto: RegisterDto) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const createdUser = await this.usersService.createUser({
      fullName: dto.fullName,
      email: dto.email,
      password: hashed,
      avatarUrl: dto.avatarUrl ?? null,
    });

    return this.buildAuthResponse({
      ...createdUser,
      password: hashed,
    } as User);
  }
}
