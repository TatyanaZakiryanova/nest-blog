export class PostResponseDto {
  id: number;
  title: string;
  text: string;
  tags: string[];
  viewsCount: number;
  commentsCount: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
  };
}
