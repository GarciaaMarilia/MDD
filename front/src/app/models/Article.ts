import { User } from './User';

export interface Article {
  id: number;
  topicId: number;
  title: string;
  createdAt: string;
  user: User;
  content: string;
}

export interface ArticleRequest {
  topicId: number;
  title: string;
  content: string;
  userId: number;
}
