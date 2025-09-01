import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TopicsComponent } from './topics.component';
import { AuthService } from 'src/app/services/AuthService/auth.service';
import { TopicsService } from 'src/app/services/Topics/topics.service';
import { SubscriptionsService } from 'src/app/services/Subscriptions/subscriptions.service';
import { User } from 'src/app/models/User';
import { Topic } from 'src/app/models/Topic';

describe('TopicsComponent (with Jest)', () => {
  let component: TopicsComponent;
  let fixture: ComponentFixture<TopicsComponent>;

  let mockAuthService: any;
  let mockTopicsService: any;
  let mockSubscriptionsService: any;

  const mockUser: User = { id: 1, username: 'Test User' } as User;
  const mockTopics: Topic[] = [
    { id: 1, title: 'Angular' } as Topic,
    { id: 2, title: 'TypeScript' } as Topic,
  ];

  beforeEach(async () => {
    mockAuthService = {
      userInfo$: of(mockUser),
    };

    mockTopicsService = {
      getAll: jest.fn().mockReturnValue(of(mockTopics)),
    };

    mockSubscriptionsService = {
      getUserSubscriptions: jest.fn().mockReturnValue(of([])),
      subscribe: jest.fn().mockReturnValue(of(mockUser)),
      unsubscribe: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [TopicsComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TopicsService, useValue: mockTopicsService },
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsComponent);
    component = fixture.componentInstance;
  });

  it('should load topics correctly', () => {
    component.getAllTopics();

    expect(mockTopicsService.getAll).toHaveBeenCalled();
    expect(component.topics.length).toBe(2);
    expect(component.topics[0].title).toBe('Angular');
  });

  it("should subscribe the user to a topic when calling 'toggleSubscription'", () => {
    component.user = mockUser;
    component.subscriptions = [];

    const reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    });

    component.toggleSubscription(1);

    expect(mockSubscriptionsService.subscribe).toHaveBeenCalledWith(
      mockUser.id,
      1
    );
    expect(reloadMock).toHaveBeenCalled();

    reloadMock.mockRestore();
  });
});
