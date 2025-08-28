package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Article;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.payload.request.ArticleRequest;
import com.openclassrooms.mddapi.payload.response.ArticleResponse;
import com.openclassrooms.mddapi.repositories.ArticlesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticlesService {

    private final ArticlesRepository articlesRepository;
    private final TopicsService topicsService;
    private final UserService userService;

    public ArticleResponse createArticle(ArticleRequest articleRequest) {
        Article article = Article.builder()
                .title(articleRequest.getTitle())
                .content(articleRequest.getContent())
                .createdAt(LocalDateTime.now())
                .topic(topicsService.getTopicById(articleRequest.getTopicId()))
                .user(userService.getUserById(articleRequest.getUserId()))
                .build();

        Article saved = articlesRepository.save(article);
        return mapToResponse(saved);
    }

    public List<ArticleResponse> getAllArticles() {
        return articlesRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ArticleResponse> getArticlesByUser(Long userId) {
        User user = userService.getUserById(userId);
        Set<Topic> subscribedTopics = user.getSubscriptions();

        if (subscribedTopics == null || subscribedTopics.isEmpty()) {
            return List.of();
        }

        List<Article> articles = articlesRepository.findByTopicIn(List.copyOf(subscribedTopics));
        return articles.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Optional<ArticleResponse> getArticleById(Long id) {
        return articlesRepository.findById(id)
                .map(this::mapToResponse);
    }

    private ArticleResponse mapToResponse(Article article) {
        return new ArticleResponse(
                article.getId(),
                article.getTopic().getId(),
                article.getTitle(),
                article.getContent(),
                article.getCreatedAt(),
                article.getUser()
        );
    }
}