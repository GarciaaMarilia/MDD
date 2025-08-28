import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/User';
import { Article } from 'src/app/models/Article';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { ArticlesService } from 'src/app/services/Articles/articles.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent implements OnInit {
  user: User = {} as User;
  articles: Article[] = [];
  sortAsc: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.authService.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.user = userInfo;
        this.loadArticles();
      }
    });
  }

  loadArticles(): void {
    if (!this.user) {
      console.warn('Utilisateur non défini');
      return;
    }
    this.articlesService.getArticlesForUser(this.user.id).subscribe({
      next: (response) => {
        this.articles = response;
        this.sortArticles();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des articles:', err);
        alert('Erreur lors de la récupération des articles .');
      },
    });
  }

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

  navigateToDetails(articleId: number): void {
    this.router.navigate([`/details-article/${articleId}`]);
  }

  onSortChange(): void {
    this.sortArticles();
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
