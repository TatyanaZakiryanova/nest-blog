import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  CreateCommentDto,
  createCommentSchema,
} from './dto/create-comment.dto';
import { AuthRequest } from 'src/auth/types/auth-request.type';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UsersService } from 'src/users/users.service';
import { createCommentResponse } from './comment.mapper';
import {
  UpdateCommentDto,
  updateCommentSchema,
} from './dto/update-comment.dto';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('posts/:id/comments')
  async createComment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(createCommentSchema)) dto: CreateCommentDto,
    @Req() req: AuthRequest,
  ): Promise<CommentResponseDto> {
    const jwtPayload = req.user;
    const user = await this.usersService.findOne(jwtPayload.id);
    const comment = await this.commentsService.createComment(dto, user, +id);
    return createCommentResponse(comment);
  }

  @Get('posts/:id/comments')
  async getAll(@Param('id') id: string): Promise<CommentResponseDto[]> {
    const comments = await this.commentsService.findByPostId(+id);
    return comments.map(createCommentResponse);
  }

  @UseGuards(AuthGuard)
  @Patch('comments/:id')
  async updateComment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCommentSchema)) dto: UpdateCommentDto,
    @Req() req: AuthRequest,
  ): Promise<CommentResponseDto> {
    const user = req.user;
    const comment = await this.commentsService.updateComment(+id, dto, user.id);
    return createCommentResponse(comment);
  }

  @UseGuards(AuthGuard)
  @Delete('comments/:id')
  async deleteComment(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    const user = req.user;
    await this.commentsService.deleteComment(+id, user.id);
  }
}
