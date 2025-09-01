import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Article, ArticleRequest } from 'src/app/models/Article';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private apiUrl = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  createItem(data: ArticleRequest): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, data);
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getArticlesForUser(userId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/user/${userId}`);
  }
}
