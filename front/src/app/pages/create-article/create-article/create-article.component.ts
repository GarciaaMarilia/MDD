import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/User';
import { ArticleRequest } from 'src/app/models/Article';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { ArticlesService } from 'src/app/services/Articles/articles.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  user: User = {} as User;

  articleForm: FormGroup;

  themes = [
    'Technologie',
    'Science',
    'Santé',
    'Sport',
    'Culture',
    'Économie',
    'Politique',
    'Environnement',
  ];

  constructor(
    private fb: FormBuilder,
    private articlesService: ArticlesService,
    private authService: AuthService
  ) {
    this.articleForm = this.fb.group({
      topic: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit() {
    this.authService.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.user = userInfo;
      }
    });
  }

  onSubmit() {
    if (this.articleForm.valid) {
      const articleData: ArticleRequest = {
        user: { id: this.user.id },
        ...this.articleForm.value,
      };

      this.articlesService.createItem(articleData).subscribe({
        next: (response) => {
          alert('Article créé avec succès!');
          this.articleForm.reset();
        },
        error: (err) => {
          console.error("Erreur lors de la création de l'article:", err);
          alert("Erreur lors de la création de l'article.");
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onGoBack() {
    window.history.back();
  }

  private markFormGroupTouched() {
    Object.keys(this.articleForm.controls).forEach((key) => {
      const control = this.articleForm.get(key);
      control?.markAsTouched();
    });
  }

  get topic() {
    return this.articleForm.get('topic');
  }
  get title() {
    return this.articleForm.get('title');
  }
  get content() {
    return this.articleForm.get('content');
  }
}
