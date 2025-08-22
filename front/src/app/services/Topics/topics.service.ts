import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Topic } from 'src/app/models/Topic';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TopicsService {
  private apiUrl = `${environment.apiUrl}/topics`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.apiUrl);
  }
}
