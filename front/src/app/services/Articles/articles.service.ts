import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { ArticleRequest, ArticleResponse } from 'src/app/models/Article';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private apiUrl = `${environment.apiUrl}/articles`;

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
    console.log(userId);
    return this.http.get<ArticleResponse[]>(`${this.apiUrl}/user/${userId}`);
  }
}
