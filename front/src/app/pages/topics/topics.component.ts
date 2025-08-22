import { Component, OnInit } from '@angular/core';

import { Topic } from 'src/app/models/Topic';
import { TopicsService } from 'src/app/services/Topics/topics.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];

  constructor(private topicsService: TopicsService) {}

  ngOnInit(): void {
    this.getAllTopics();
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
}
