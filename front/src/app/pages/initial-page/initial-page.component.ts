import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from 'src/app/models/Article';

@Component({
  selector: 'app-initial-page',
  templateUrl: './initial-page.component.html',
  styleUrls: ['./initial-page.component.scss'],
})
export class InitialPageComponent implements OnInit {
  articles: Article[] = [];
  sortBy: string = 'date'; // 'date' ou 'title'

  // Dados mock para demonstração
  mockArticles: Article[] = [
    {
      id: 1,
      title: "Titre de l'article",
      date: '2024-08-21',
      author: 'Auteur',
      content:
        "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
    },
    {
      id: 2,
      title: "Titre de l'article",
      date: '2024-08-20',
      author: 'Auteur',
      content:
        "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
    },
    {
      id: 3,
      title: "Titre de l'article",
      date: '2024-08-19',
      author: 'Auteur',
      content:
        "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
    },
    {
      id: 4,
      title: "Titre de l'article",
      date: '2024-08-18',
      author: 'Auteur',
      content:
        "Content: lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled...",
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    // Aqui você faria a chamada para sua API
    // this.articleService.getArticles().subscribe(articles => {
    //   this.articles = articles;
    //   this.sortArticles();
    // });

    // Por enquanto, usando dados mock
    this.articles = [...this.mockArticles];
    this.sortArticles();
  }

  onCreateArticle(): void {
    this.router.navigate(['/create-article']);
  }

  onSortChange(): void {
    this.sortArticles();
  }

  private sortArticles(): void {
    this.articles.sort((a, b) => {
      if (this.sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  onArticleClick(article: Article): void {
    this.router.navigate(['/article', article.id]);
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
