import { Component, OnInit } from '@angular/core';

import { Topic } from 'src/app/models/Topic';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { SubscriptionsService } from 'src/app/services/Subscriptions/subscriptions.service';
import { TopicsService } from 'src/app/services/Topics/topics.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {
  user: User = {} as User;
  topics: Topic[] = [];

  constructor(
    private authService: AuthService,
    private topicsService: TopicsService,
    private subscriptionsService: SubscriptionsService
  ) {}

  ngOnInit(): void {
    this.getAllTopics();
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.user = userInfo;
      }
    });
  }

  getAllTopics() {
    this.topicsService.getAll().subscribe({
      next: (response) => {
        this.topics = [...response];
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des topics:', err);
      },
    });
  }

  isSubscribed(topicId: number): boolean {
    return this.subscriptionsService.isSubscribed(this.user, topicId);
  }

  toggleSubscription(topicId: number) {
    console.log('aaaa', topicId);
    if (this.isSubscribed(topicId)) {
      this.subscriptionsService
        .unsubscribe(this.user.id, topicId)
        .subscribe((user) => {
          this.user = user;
        });
    } else {
      this.subscriptionsService
        .subscribe(this.user.id, topicId)
        .subscribe((user) => {
          this.user = user;
        });
    }
  }

  // Retorna o título correto do botão
  getButtonTitle(topicId: number): string {
    return this.isSubscribed(topicId) ? 'Se désabonner' : "S'abonner";
  }
}
