import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { User } from 'src/app/models/User';
import { Topic } from 'src/app/models/Topic';
import { Article } from 'src/app/models/Article';
import { TopicsService } from 'src/app/services/Topics/topics.service';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { CommentRequest, CommentResponse } from 'src/app/models/Comment';
import { ArticlesService } from 'src/app/services/Articles/articles.service';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.scss'],
})
export class DetailArticleComponent implements OnInit, OnDestroy {
  user: User | null = null;
  articleId: number = 0;
  article: Article | null = null;
  topicTitle: string = 'Inconnu';
  comments: CommentResponse[] = [];
  commentForm!: FormControl;
  isLoading: boolean = false;
  isSubmittingComment: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private authService: AuthService,
    private topicsService: TopicsService,
    private articlesService: ArticlesService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getArticleData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.commentForm = this.fb.control('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1000),
    ]);
  }

  private getCurrentUser(): void {
    this.authService.userInfo$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (userInfo) => {
        this.user = userInfo;
      },
      error: (error) => {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur :",
          error
        );
      },
    });
  }

  private getArticleData(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error("ID de l'article non trouvé");
      return;
    }

    this.articleId = Number(id);
    this.isLoading = true;

    this.articlesService
      .getById(this.articleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article) => {
          this.article = article;
          this.getTopicTitle(article.topicId);
          this.loadComments();
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Erreur lors du chargement de l'article :", error);
          this.isLoading = false;
        },
      });
  }

  private getTopicTitle(topicId: number): void {
    this.topicsService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (topics: Topic[]) => {
          const topic = topics.find((t: Topic) => t.id === topicId);
          this.topicTitle = topic?.title ?? 'Inconnu';
        },
        error: (error) => {
          console.error('Erreur lors du chargement des sujets :', error);
        },
      });
  }

  private loadComments(): void {
    this.articlesService
      .getCommentsByArticleId(this.articleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comments) => {
          this.comments = comments;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des commentaires :', error);
        },
      });
  }

  createComment(): void {
    if (!this.commentForm.valid || !this.user || this.isSubmittingComment) {
      return;
    }

    const commentData: CommentRequest = {
      content: this.commentForm.value.trim(),
      userId: this.user.id,
    };

    this.isSubmittingComment = true;

    this.articlesService
      .createComment(this.articleId, commentData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comment) => {
          console.log('Commentaire créé avec succès :', comment);
          this.commentForm.reset();
          this.loadComments();
          this.isSubmittingComment = false;
        },
        error: (error) => {
          console.error('Erreur lors de la création du commentaire :', error);
          this.isSubmittingComment = false;
        },
      });
  }

  goBack(): void {
    this.location.back();
  }

  get commentContent(): string {
    return this.commentForm.value || '';
  }

  get isFormValid(): boolean {
    return this.commentForm.valid;
  }
}
