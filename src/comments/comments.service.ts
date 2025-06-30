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

  async findByPostId(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateComment(
    id: number,
    dto: UpdateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('Access denied');

    Object.assign(comment, {
      text: dto.text,
    });

    const saved = await this.commentsRepository.save(comment);
    return saved;
  }

  async deleteComment(id: number, userId: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });

    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('Access denied');

    await this.commentsRepository.delete(id);
    await this.postsService.decrementCommentsCount(comment.post.id);
  }
}
