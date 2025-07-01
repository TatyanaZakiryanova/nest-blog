import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/posts/post.entity';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}

  private removeSensitiveFields(user: User): Omit<User, 'password'> {
    const { password, ...clean } = user;
    return clean;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => this.removeSensitiveFields(user));
  }

  async findOne(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.removeSensitiveFields(user);
  }

  async deleteUser(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async deletePost(id: number): Promise<void> {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Post not found');
  }

  async deleteComment(id: number): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: {
        post: true,
      },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    await this.commentsRepository.delete(id);
    await this.postsService.decrementCommentsCount(comment.post.id);
  }
}
