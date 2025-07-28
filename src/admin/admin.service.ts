import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from 'src/posts/post.entity';
import { User } from 'src/users/user.entity';
import { Comment } from 'src/comments/comment.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
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
    await this.dataSource.transaction(async (manager) => {
      const comment = await manager.findOne(Comment, {
        where: { id },
        relations: {
          post: true,
        },
      });

      if (!comment) throw new NotFoundException('Comment not found');

      await manager.delete(Comment, id);
      await manager.decrement(
        Post,
        { id: comment.post.id },
        'commentsCount',
        1,
      );
    });
  }
}
