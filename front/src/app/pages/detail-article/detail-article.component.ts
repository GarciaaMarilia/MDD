import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Topic } from 'src/app/models/Topic';
import { Article } from 'src/app/models/Article';
import { TopicsService } from 'src/app/services/Topics/topics.service';
import { ArticlesService } from 'src/app/services/Articles/articles.service';

interface Comment {
  username: string;
  content: string;
}

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss'],
})
export class DetailArticleComponent implements OnInit {
  articleId!: number;
  article!: Article;
  topicTitle: string = 'Inconnu';

  comments: Comment[] = [
    { username: 'username', content: 'contenu du commentaire' },
  ];

  newComment: string = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private topicsService: TopicsService,
    public articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    this.getArticle();
  }

  goBack(): void {
    this.location.back();
  }

  getArticle() {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    this.articlesService.getById(this.articleId).subscribe((response) => {
      this.article = response;
      this.topicsService.getAll().subscribe((topics: Topic[]) => {
        const topic = topics.find((t: Topic) => t.id === this.article.topicId);
        this.topicTitle = topic?.title ?? 'Inconnu';
      });
    });
  }

  addComment(): void {
    if (this.newComment.trim()) {
      this.comments.push({
        username: 'Utilisateur',
        content: this.newComment.trim(),
      });
      this.newComment = '';
    }
  }
}
