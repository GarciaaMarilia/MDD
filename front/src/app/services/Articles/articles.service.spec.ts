import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ArticlesService } from './articles.service';
import { environment } from 'src/environments/environment';
import { Article, ArticleRequest } from 'src/app/models/Article';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let httpMock: HttpTestingController;

  const mockUser = { id: 1, username: 'John Doe', email: 'john@example.com' };
  const mockArticle: Article = {
    id: 1,
    topicId: 100,
    title: 'Test Article',
    content: 'This is a test article',
    createdAt: new Date().toISOString(),
    user: mockUser,
  };
  const mockArticles: Article[] = [mockArticle];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticlesService],
    });

    service = TestBed.inject(ArticlesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an article', () => {
    const articleRequest: ArticleRequest = {
      topicId: 100,
      title: 'Test Article',
      content: 'This is a test article',
      userId: 1,
    };

    service.createItem(articleRequest).subscribe((res) => {
      expect(res).toEqual(mockArticle);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/articles`);
    expect(req.request.method).toBe('POST');
    req.flush(mockArticle);
  });

  it('should get an article by id', () => {
    service.getById(1).subscribe((res) => {
      expect(res).toEqual(mockArticle);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/articles/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticle);
  });

  it('should get all articles', () => {
    service.getAll().subscribe((res) => {
      expect(res).toEqual(mockArticles);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/articles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticles);
  });

  it('should get articles for a specific user', () => {
    service.getArticlesForUser(1).subscribe((res) => {
      expect(res).toEqual(mockArticles);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/articles/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticles);
  });
});
