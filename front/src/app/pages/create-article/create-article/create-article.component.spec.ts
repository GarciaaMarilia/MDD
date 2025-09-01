import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CreateArticleComponent } from './create-article.component';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { ArticlesService } from 'src/app/services/Articles/articles.service';
import { TopicsService } from 'src/app/services/Topics/topics.service';
import { User } from 'src/app/models/User';
import { Topic } from 'src/app/models/Topic';

describe('CreateArticleComponent', () => {
  let component: CreateArticleComponent;
  let fixture: ComponentFixture<CreateArticleComponent>;

  let mockAuthService: any;
  let mockTopicsService: any;
  let mockArticlesService: any;

  const MOCK_USER: User = {
    id: 1,
    username: 'Test',
    email: 'test@example.com',
  };
  const MOCK_TOPICS: Topic[] = [
    { id: 1, title: 'Angular', content: 'Angular content' },
    { id: 2, title: 'React', content: 'React content' },
  ];

  beforeEach(async () => {
    mockAuthService = { userInfo$: of(MOCK_USER) };
    mockTopicsService = { getAll: jest.fn().mockReturnValue(of(MOCK_TOPICS)) };
    mockArticlesService = { createItem: jest.fn().mockReturnValue(of({})) };

    await TestBed.configureTestingModule({
      declarations: [CreateArticleComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TopicsService, useValue: mockTopicsService },
        { provide: ArticlesService, useValue: mockArticlesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.user).toEqual(MOCK_USER);
    expect(component.topics).toEqual(MOCK_TOPICS);
  });

  it('should submit the form successfully', () => {
    component.articleForm.setValue({
      topic: MOCK_TOPICS[0].id,
      title: 'Un article de test',
      content: "Ceci est un contenu de test pour l'article",
    });

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onSubmit();

    expect(mockArticlesService.createItem).toHaveBeenCalledWith({
      userId: MOCK_USER.id,
      topicId: MOCK_TOPICS[0].id,
      title: 'Un article de test',
      content: "Ceci est un contenu de test pour l'article",
    });

    expect(alertSpy).toHaveBeenCalledWith('Article créé avec succès!');
    expect(component.articleForm.value.title).toBeNull();
    alertSpy.mockRestore();
  });

  it('should handle error on form submission', () => {
    component.articleForm.setValue({
      topic: MOCK_TOPICS[0].id,
      title: 'Un article de test',
      content: "Ceci est un contenu de test pour l'article",
    });

    const error = { error: 'Server error' };
    mockArticlesService.createItem.mockReturnValueOnce(throwError(() => error));

    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Erreur lors de la création de l'article:",
      error
    );
    expect(alertSpy).toHaveBeenCalledWith(
      "Erreur lors de la création de l'article."
    );

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });
});
