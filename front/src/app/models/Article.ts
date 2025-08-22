import { User } from './User';

export interface Article {
  id: number;
  topic: string;
  title: string;
  createdAt: string;
  user: User;
  content: string;
}

export interface ArticleRequest {
  topic: string;
  title: string;
  content: string;
  userId: number;
}

export interface ArticleResponse {
  id: number;
  topic: string;
  title: string;
  content: string;
  createdAt: string;
  user: User;
}
