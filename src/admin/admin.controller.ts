import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/users/role.enum';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAll() {
    return this.adminService.findAll();
  }

  @Get('users/:id')
  async getById(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Delete('users/:id')
  async deleteUserById(@Param('id') id: string) {
    return this.adminService.deleteUser(+id);
  }

  @Delete('posts/:id')
  async deletePostById(@Param('id') id: string) {
    return this.adminService.deletePost(+id);
  }

  @Delete('comments/:id')
  async deleteCommentById(@Param('id') id: string) {
    return this.adminService.deleteComment(+id);
  }
}
