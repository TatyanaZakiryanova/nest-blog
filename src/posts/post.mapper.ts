import { PostResponseDto } from './dto/post-response.dto';
import { Post } from './post.entity';

export function createPostResponse(post: Post): PostResponseDto {
  return {
    data: {
      id: post.id,
      title: post.title,
      text: post.text,
      tags: post.tags,
      viewsCount: post.viewsCount,
      commentsCount: post.commentsCount,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: post.user.id,
        fullName: post.user.fullName,
        avatarUrl: post.user.avatarUrl,
      },
    },
  };
}
