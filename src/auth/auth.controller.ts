import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, loginSchema } from './dto/login-dto';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { RegisterDto, registerSchema } from './dto/register-dto';
import { AuthGuard } from './guards/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const userId = req['user']?.id;

    if (!userId) throw new UnauthorizedException('Invalid token payload');

    const user = await this.usersService.findOne(userId);

    const { password, ...cleanUser } = user;
    return cleanUser;
  }
}
