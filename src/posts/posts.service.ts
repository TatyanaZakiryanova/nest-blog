import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async createPost(
    dto: CreatePostDto,
    user: Omit<User, 'password' | 'role'>,
  ): Promise<Post> {
    const post = this.postsRepository.create({
      title: dto.title,
      text: dto.text,
      tags: dto.tags,
      imageUrl: dto.imageUrl ?? null,
      user,
    });
    const saved = await this.postsRepository.save(post);
    return saved;
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    data: Post[];
    meta: {
      total: number;
      page: number;
      lastPage: number;
    };
  }> {
    const [data, total] = await this.postsRepository.findAndCount({
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

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    await this.incrementViewsCount(id);
    return post;
  }

  async getPostById(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return post;
  }

  async updatePost(
    id: number,
    dto: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== userId) throw new ForbiddenException('Access denied');

    Object.assign(post, {
      title: dto.title,
      text: dto.text,
      tags: dto.tags,
      imageUrl: dto.imageUrl ?? null,
    });

    const saved = await this.postsRepository.save(post);
    return saved;
  }

  async deletePost(id: number, userId: number): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== userId) throw new ForbiddenException('Access denied');

    await this.postsRepository.delete(id);
  }

  async incrementCommentsCount(postId: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'commentsCount', 1);
  }

  async decrementCommentsCount(postId: number): Promise<void> {
    await this.postsRepository.decrement({ id: postId }, 'commentsCount', 1);
  }

  async incrementViewsCount(postId: number): Promise<void> {
    await this.postsRepository.increment({ id: postId }, 'viewsCount', 1);
  }
}
