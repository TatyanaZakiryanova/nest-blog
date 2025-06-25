import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async createPost(dto: CreatePostDto, user: User): Promise<Post> {
    const newPost = this.postsRepository.create({
      title: dto.title,
      text: dto.text,
      tags: dto.tags,
      imageUrl: dto.imageUrl || '',
      user: user,
    });

    return await this.postsRepository.save(newPost);
  }
}
