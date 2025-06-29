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
  UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostResponseDto } from './dto/post-response.dto';
import { createPostResponse } from './post.mapper';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CreatePostDto, createPostSchema } from './dto/create-post.dto';
import { UpdatePostDto, updatePostSchema } from './dto/update-post.dto';
import { AuthRequest } from 'src/auth/types/auth-request.type';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(createPostSchema))
  async createPost(
    @Body() dto: CreatePostDto,
    @Req() req: AuthRequest,
  ): Promise<PostResponseDto> {
    const jwt = req.user;
    const user = await this.usersService.findOne(jwt.id);
    const post = await this.postsService.createPost(dto, user);
    return createPostResponse(post);
  }

  @Get()
  async getAll(): Promise<PostResponseDto[]> {
    const posts = await this.postsService.findAll();
    return posts.map(createPostResponse);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<PostResponseDto> {
    const post = await this.postsService.findOne(+id);
    return createPostResponse(post);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updatePost(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) dto: UpdatePostDto,
    @Req() req: AuthRequest,
  ): Promise<PostResponseDto> {
    const user = req.user;
    const post = await this.postsService.updatePost(+id, dto, user.id);
    return createPostResponse(post);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    const user = req.user;
    await this.postsService.deletePost(+id, user.id);
  }
}
