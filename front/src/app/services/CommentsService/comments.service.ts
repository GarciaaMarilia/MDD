import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { CommentRequest, CommentResponse } from 'src/app/models/Comment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  createComment(
    articleId: number,
    data: CommentRequest
  ): Observable<CommentResponse> {
    return this.http.post<CommentResponse>(
      `${this.apiUrl}/article/${articleId}`,
      data
    );
  }

  getCommentsByArticleId(articleId: number): Observable<CommentResponse[]> {
    return this.http.get<CommentResponse[]>(
      `${this.apiUrl}/article/${articleId}`
    );
  }
}
