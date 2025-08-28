import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/User';
import { Topic } from 'src/app/models/Topic';
import { TopicsService } from 'src/app/services/Topics/topics.service';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { SubscriptionsService } from 'src/app/services/Subscriptions/subscriptions.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {
  user: User = {} as User;
  topics: Topic[] = [];
  subscriptions: Topic[] = [];

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

        this.subscriptionsService
          .getUserSubscriptions(this.user.id)
          .subscribe((subs) => {
            this.subscriptions = subs;
          });
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
    return this.subscriptions.some((topic: Topic) => topic.id === topicId);
  }

  toggleSubscription(topicId: number) {
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

  getButtonTitle(topicId: number): string {
    return this.isSubscribed(topicId) ? 'Déjà abonné' : "S'abonner";
  }

  getDisabledButton(topicId: number): boolean {
    return this.isSubscribed(topicId);
  }
}
