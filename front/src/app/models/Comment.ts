import { User } from './User';

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
