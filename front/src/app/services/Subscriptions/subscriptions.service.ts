import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic } from 'src/app/models/Topic';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Inscrever usuário em um tópico
  subscribe(userId: number, topicId: number): Observable<any> {
    console.log(userId, topicId);
    return this.http.post(`${this.apiUrl}/${userId}/subscribe/${topicId}`, {});
  }

  // Cancelar inscrição do usuário em um tópico
  unsubscribe(userId: number, topicId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/unsubscribe/${topicId}`);
  }

  // Verificar se o usuário está inscrito em um tópico (opcional)
  isSubscribed(user: any, topicId: number): boolean {
    if (!user || !user.subscriptions) return false;
    return user.subscriptions.some((t: any) => t.id === topicId);
  }

  getUserSubscriptions(userId: number): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.apiUrl}/${userId}/subscriptions`);
  }
}
