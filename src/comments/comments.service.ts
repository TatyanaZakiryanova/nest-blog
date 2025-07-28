import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/user.entity';
import { PostsService } from 'src/posts/posts.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}

  async createComment(
    dto: CreateCommentDto,
    user: Omit<User, 'password' | 'role'>,
    postId: number,
  ): Promise<Comment> {
    const post = await this.postsService.getPostById(postId);

    const comment = this.commentsRepository.create({
      text: dto.text,
      user,
      post,
    });

    const saved = await this.commentsRepository.save(comment);
    await this.postsService.incrementCommentsCount(post.id);

    return saved;
  }

  async findByPostId(
    postId: number,
    page = 1,
    limit = 10,
  ): Promise<{
    data: Comment[];
    meta: {
      total: number;
      page: number;
      lastPage: number;
    };
  }> {
    const [data, total] = await this.commentsRepository.findAndCount({
      where: { post: { id: postId } },
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        user: true,
      },
      order: { createdAt: 'DESC' },
    });

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
      },
    };
  }

  async updateComment(
    id: number,
    dto: UpdateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('Access denied');

    if (dto.text !== undefined) comment.text = dto.text;

    const saved = await this.commentsRepository.save(comment);
    return saved;
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: {
        user: true,
        post: true,
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('Access denied');

    await this.commentsRepository.delete(id);
    await this.postsService.decrementCommentsCount(comment.post.id);
  }
}
