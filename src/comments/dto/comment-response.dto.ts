export class CommentResponseDto {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
  };
}
