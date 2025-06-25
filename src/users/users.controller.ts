import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAll(): Promise<Partial<User>[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Partial<User>> {
    return this.usersService.findOne(+id);
  }
}
