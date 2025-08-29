import { User } from './User';
import { ArticleResponse } from './Article';

export interface CommentRequest {
  content: string;
  userId: number;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}
