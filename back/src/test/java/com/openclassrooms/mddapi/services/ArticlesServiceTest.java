package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.payload.request.ArticleRequest;
import com.openclassrooms.mddapi.payload.response.ArticleResponse;
import com.openclassrooms.mddapi.repositories.ArticlesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ArticlesServiceTest {

    @Mock
    private ArticlesRepository articlesRepository;
    @Mock
    private TopicsService topicsService;
    @Mock
    private UserService userService;

    @InjectMocks
    private ArticlesService articlesService;

    private User user;
    private Topic topic;
    private Article article;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setId(1L);
        user.setUsername("User test");

        topic = new Topic();
        topic.setId(10L);
        topic.setTitle("Cybersecurity");
        topic.setContent("Description");

        article = Article.builder()
                .id(100L)
                .title("Cybersecurity article")
                .content("Cybersecurity article content")
                .createdAt(LocalDateTime.now())
                .user(user)
                .topic(topic)
                .build();
    }

    @Test
    void createArticle_ShouldReturnArticleResponse_WhenValidRequest() {
        ArticleRequest request = new ArticleRequest();
        request.setTitle("New article");
        request.setContent("New content");
        request.setTopicId(topic.getId());
        request.setUserId(user.getId());

        when(topicsService.getTopicById(request.getTopicId())).thenReturn(topic);
        when(userService.getUserById(request.getUserId())).thenReturn(user);
        when(articlesRepository.save(any(Article.class))).thenReturn(article);

        ArticleResponse response = articlesService.createArticle(request);

        assertNotNull(response);
        assertEquals(article.getId(), response.getId());
        assertEquals(article.getTitle(), response.getTitle());
        assertEquals(article.getContent(), response.getContent());
        assertEquals(article.getUser(), response.getUser());
        verify(articlesRepository, times(1)).save(any(Article.class));
    }

    @Test
    void getArticlesByUser_ShouldReturnArticles_WhenUserHasSubscriptions() {
        user.setSubscriptions(Set.of(topic));

        when(userService.getUserById(user.getId())).thenReturn(user);
        when(articlesRepository.findByTopicIn(List.of(topic))).thenReturn(List.of(article));

        List<ArticleResponse> responses = articlesService.getArticlesByUser(user.getId());

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(article.getId(), responses.get(0).getId());
    }

    @Test
    void getArticlesByUser_ShouldReturnEmptyList_WhenUserHasNoSubscriptions() {
        user.setSubscriptions(Set.of());

        when(userService.getUserById(user.getId())).thenReturn(user);

        List<ArticleResponse> responses = articlesService.getArticlesByUser(user.getId());

        assertNotNull(responses);
        assertTrue(responses.isEmpty());
        verify(articlesRepository, never()).findByTopicIn(any());
    }

    @Test
    void getArticlesByUser_ShouldReturnEmptyList_WhenSubscriptionsIsNull() {
        user.setSubscriptions(null);

        when(userService.getUserById(user.getId())).thenReturn(user);

        List<ArticleResponse> responses = articlesService.getArticlesByUser(user.getId());

        assertNotNull(responses);
        assertTrue(responses.isEmpty());
        verify(articlesRepository, never()).findByTopicIn(any());
    }
}
