import { CommentResponseDto } from './dto/comment-response.dto';
import { Comment } from './comment.entity';

export function createCommentResponse(comment: Comment): CommentResponseDto {
  return {
    id: comment.id,
    text: comment.text,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: {
      id: comment.user.id,
      fullName: comment.user.fullName,
      avatarUrl: comment.user.avatarUrl,
    },
  };
}
