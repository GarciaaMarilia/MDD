import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ArticleRequest, ArticleResponse } from 'src/app/models/Article';
import { CommentRequest, CommentResponse } from 'src/app/models/Comment';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private apiUrl = `${environment.apiUrl}/articles`;
  private apiUrlComments = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  createItem(data: ArticleRequest): Observable<ArticleResponse> {
    return this.http.post<ArticleResponse>(this.apiUrl, data);
  }

  getById(id: number): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ArticleResponse[]> {
    return this.http.get<ArticleResponse[]>(this.apiUrl);
  }

  getArticlesForUser(userId: number): Observable<ArticleResponse[]> {
    return this.http.get<ArticleResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  createComment(
    articleId: number,
    data: CommentRequest
  ): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(
      `${this.apiUrlComments}/article/${articleId}`,
      data
    );
  }

  getCommentsByArticleId(articleId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(
      `${this.apiUrlComments}/article/${articleId}`
    );
  }
}
