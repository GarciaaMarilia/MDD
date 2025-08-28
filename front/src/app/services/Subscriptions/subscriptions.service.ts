import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Topic } from 'src/app/models/Topic';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  subscribe(userId: number, topicId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/subscribe/${topicId}`, {});
  }

  unsubscribe(userId: number, topicId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/unsubscribe/${topicId}`);
  }

  getUserSubscriptions(userId: number): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl}/${userId}/subscriptions`);
  }
}
