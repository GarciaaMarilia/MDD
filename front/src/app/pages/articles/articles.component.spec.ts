import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ArticlesComponent } from './articles.component';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { ArticlesService } from 'src/app/services/Articles/articles.service';
import { User } from 'src/app/models/User';
import { Article } from 'src/app/models/Article';

const MOCK_DATA = {
  user: {
    id: 1,
    username: 'Test User',
    email: 'test@example.com',
  } as User,

  articles: [
    {
      id: 1,
      topicId: 101,
      title: 'First Article',
      content: 'Content 1',
      createdAt: '2023-01-01T10:00:00Z',
      user: {
        id: 1,
        username: 'Test User',
        email: 'test@example.com',
      },
    },
    {
      id: 2,
      topicId: 102,
      title: 'Second Article',
      content: 'Content 2',
      createdAt: '2023-02-01T10:00:00Z',
      user: {
        id: 1,
        username: 'Test User',
        email: 'test@example.com',
      },
    },
  ] as Article[],

  createArticle: (overrides: Partial<Article> = {}): Article => ({
    id: Math.floor(Math.random() * 1000),
    topicId: 999,
    title: 'Test Article',
    content: 'Test Content',
    createdAt: new Date().toISOString(),
    user: {
      id: 1,
      username: 'Test User',
      email: 'test@example.com',
    },
    ...overrides,
  }),
};

describe('ArticlesComponent', () => {
  let component: ArticlesComponent;
  let fixture: ComponentFixture<ArticlesComponent>;
  let mockRouter: any;
  let mockAuthService: any;
  let mockArticlesService: any;

  beforeEach(async () => {
    // Criar mocks
    mockRouter = { navigate: jest.fn() };
    mockAuthService = {
      userInfo$: of(MOCK_DATA.user),
    };
    mockArticlesService = {
      getArticlesForUser: jest.fn().mockReturnValue(of(MOCK_DATA.articles)),
    };

    await TestBed.configureTestingModule({
      declarations: [ArticlesComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ArticlesService, useValue: mockArticlesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesComponent);
    component = fixture.componentInstance;
  });

  // =======================
  // TESTE 1: Inicialização
  // =======================
  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load user info and articles on init', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.user).toEqual(MOCK_DATA.user);
    expect(mockArticlesService.getArticlesForUser).toHaveBeenCalledWith(
      MOCK_DATA.user.id
    );
    expect(component.articles).toEqual(MOCK_DATA.articles);
  });

  it('should handle error when loading articles fails', () => {
    const serverError = { error: 'Server error' };
    mockArticlesService.getArticlesForUser.mockReturnValue(
      throwError(() => serverError)
    );

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.user = MOCK_DATA.user;
    component.loadArticles();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Erreur lors de la récupération des articles:',
      serverError
    );
    expect(alertSpy).toHaveBeenCalledWith(
      'Erreur lors de la récupération des articles .'
    );

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('should not load articles if user is undefined', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    component.user = null as any;

    component.loadArticles();

    expect(consoleSpy).toHaveBeenCalledWith('Utilisateur non défini');
    expect(mockArticlesService.getArticlesForUser).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  // =======================
  // TESTE 2: Ordenação
  // =======================
  describe('Article Sorting', () => {
    beforeEach(() => {
      component.articles = [...MOCK_DATA.articles];
    });

    it('should sort articles ascending by date', () => {
      component.sortAsc = true;
      component.sortArticles();

      expect(component.articles[0].id).toBe(1);
      expect(component.articles[1].id).toBe(2);
    });

    it('should toggle sort order', () => {
      const initialOrder = component.sortAsc;

      component.toggleSortOrder();

      expect(component.sortAsc).toBe(!initialOrder);
      expect(component.articles[0].id).toBe(2);
      expect(component.articles[1].id).toBe(1);
    });
  });

  // =======================
  // TESTE 3: Navegação
  // =======================
  describe('Navigation', () => {
    it('should navigate to create article page', () => {
      component.onCreateArticle();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-article']);
    });

    it('should navigate to article details', () => {
      const articleId = 123;
      component.navigateToDetails(articleId);
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        `/details-article/${articleId}`,
      ]);
    });
  });

  // =======================
  // TESTE 4: Utilitários
  // =======================
  it('should format date correctly', () => {
    const testDate = '2023-01-15T10:30:00Z';
    const formatted = component.formatDate(testDate);
    expect(formatted).toMatch(/\d{1,2} \w+ \d{4}/);
  });

  it('should track articles by id', () => {
    const article = MOCK_DATA.articles[0];
    const result = component.trackByArticleId(0, article);
    expect(result).toBe(article.id);
  });
});
