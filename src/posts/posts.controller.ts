import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CreatePostDto, createPostSchema } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
}
