import { Router } from '@angular/router';

import { Article } from 'src/app/models/Article';
import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/services/Articles/articles.service';

@Component({
  selector: 'app-initial-page',
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss'],
})
export class InitialPageComponent implements OnInit {
  articles: Article[] = [];

  constructor(
    private router: Router,
    private articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articlesService.getAll().subscribe({
      next: (response) => {
        this.articles = [...response];
      },
      error: (err) => {
        console.error("Erreur lors de la création de l'article:", err);
        alert("Erreur lors de la création de l'article.");
      },
    });

    this.sortArticles();
  }

  sortAsc: boolean = true;

  toggleSortOrder(): void {
    this.sortAsc = !this.sortAsc;
    this.sortArticles();
  }

  sortArticles(): void {
    if (this.sortAsc) {
      this.articles.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else {
      this.articles.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  }

  onCreateArticle(): void {
    this.router.navigate(['/create-article']);
  }

  onSortChange(): void {
    this.sortArticles();
  }

  onArticleClick(id: number): void {
    this.router.navigate(['/article', id]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  trackByArticleId(index: number, article: Article): number {
    return article.id;
  }
}
